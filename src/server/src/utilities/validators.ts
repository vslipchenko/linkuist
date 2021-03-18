import {Constructable} from '../types/utility/utility.types';

type ComplexPattern = Record<string, RegExp | Constructable>;

interface CheckDataValidityOptions {
  data: unknown;
  pattern: RegExp | Constructable | ComplexPattern;
  pathsToCheck?: Array<string>;
  outputInvalidPaths?: boolean;
}

type CheckDataValidityResult = [boolean] | [boolean, Array<string>];

export const checkDataValidity = ({
  data,
  pattern,
  pathsToCheck = [],
  outputInvalidPaths = false,
}: CheckDataValidityOptions): CheckDataValidityResult => {
  const invalidPaths: Array<string> = [];

  const validateRecursively = (value: any, path: Array<string> = []): void => {
    if (value instanceof Object) {
      // Allows to validate arrays and objects with non-numeric keys
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const currentPath: Array<string> = [...path];
          // Omit numeric keys in path due to ambiguity, e.g., instead of pathsToCheck = ['arrayToCheck.0', 'arrayToCheck.1'] it would be pathsToCheck = ['arrayToCheck']
          isNaN(Number(key)) && currentPath.push(key);

          validateRecursively(value[key], currentPath);
        }
      }
    } else {
      const fullPath = path.join('.') || 'data'; // Assign data key in case if validating array or primitive value, in that case path result of join is ''

      // Validate entire data object or specific paths, check for duplicate invalid paths in case of array values validation
      if (
        !invalidPaths.includes(fullPath) &&
        (!pathsToCheck.length || pathsToCheck.includes(fullPath))
      ) {
        // RegExp
        if (pattern instanceof RegExp) {
          if (!pattern.test(value)) {
            invalidPaths.push(fullPath);
          }
          return;
        }

        // If paths specified, e.g. { name: <RegExp>/[a-z]/, link: <Constructable>URL }
        if (pattern.constructor === Object) {
          if (Object.prototype.hasOwnProperty.call(pattern, fullPath)) {
            // Record<string, RegExp>
            if ((pattern as ComplexPattern)[fullPath] instanceof RegExp) {
              if (!((pattern as ComplexPattern)[fullPath] as RegExp).test(value)) {
                invalidPaths.push(fullPath);
              }
              return;
            }
            // Record<string, Constructable>
            try {
              new ((pattern as ComplexPattern)[fullPath] as Constructable)(value);
            } catch {
              invalidPaths.push(fullPath);
            }
          }
          return;
        }

        // Constructable
        try {
          new (pattern as Constructable)(value);
        } catch {
          invalidPaths.push(fullPath);
        }
      }
    }
  };

  validateRecursively(data);

  return invalidPaths.length ? (outputInvalidPaths ? [false, invalidPaths] : [false]) : [true];
};

// console.log(checkDataValidity({
//     data: [1,2,3],
//     pattern: /[0-9]/,
//     outputInvalidPaths: true
// }));

// console.log(checkDataValidity({
//     data: 'http://www.youtube.com/watch?v=Xkulh9QfBm4&ab_channel=%24uicideboy%24',
//     pattern: URL,
//     outputInvalidPaths: true
// }));

// console.log(
//   checkDataValidity({
//     data: {
//       number: 3,
//       strings: ['first', 'second'],
//     },
//     pattern: {number: /[0-9]/, strings: /[a-z]/},
//     outputInvalidPaths: true,
//     pathsToCheck: ['number', 'strings'],
//   }),
// );

// export const getComposedRegExp = (regExps: RegExp[], flags?: string): RegExp => {
//   return RegExp(regExps.map(regExp => regExp.source).join("|"), flags);
// };
