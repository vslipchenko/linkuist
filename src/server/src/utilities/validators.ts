import {Constructable} from '../types/utility/utility.types';

type PatternArrowFunction = (value: any) => boolean;
type Pattern = RegExp | Constructable | PatternArrowFunction; // e.g. /[a-z]/ | URL | (value: any) => boolean (isValid)
type ComplexPattern = Record<string, Pattern>;

interface CheckDataValidityOptions {
  data: unknown;
  pattern: Pattern | ComplexPattern;
  pathsToCheck?: Array<string>;
  outputInvalidPaths?: boolean;
  ignoreNumericKeys?: boolean;
}

type CheckDataValidityResult =
  | {isValidData: boolean}
  | {isValidData: boolean; invalidPaths: Array<string>};

export const checkDataValidity = ({
  data,
  pattern, // Expect RegExp | Constructable | PatternArrowFunction OR ComplexPattern
  pathsToCheck = [],
  outputInvalidPaths = false,
  ignoreNumericKeys = true,
}: CheckDataValidityOptions): CheckDataValidityResult => {
  const invalidPaths: Array<string> = [];

  const validateRecursively = (value: any, path: Array<string> = []): void => {
    if (value instanceof Object) {
      // Allows to validate arrays and objects with non-numeric keys
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const currentPath: Array<string> = [...path];
          // Omit numeric keys in path due to ambiguity, e.g., instead of pathsToCheck = ['arrayToCheck.0', 'arrayToCheck.1'] it would be pathsToCheck = ['arrayToCheck']
          if (ignoreNumericKeys) {
            if (isNaN(Number(key))) {
              currentPath.push(key);
            }
          } else {
            currentPath.push(key);
          }
          // ignoreIndices && isNaN(Number(key)) && currentPath.push(key);

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
        // Fall-through condition is intentional in order to trap in suitable condition and prevent further conditions check
        if (pattern instanceof RegExp) {
          if (!pattern.test(value)) invalidPaths.push(fullPath);
          return;
        }

        // (value: any) => boolean
        if (pattern instanceof Function && !pattern.prototype) {
          if (!(pattern as PatternArrowFunction)(value)) invalidPaths.push(fullPath);
          return;
        }

        // If paths specified, e.g. { name: <RegExp>/[a-z]/, link: <Constructable>URL, isValidPassword: <Function>(value: any) => boolean }
        if (pattern.constructor === Object) {
          if (Object.prototype.hasOwnProperty.call(pattern, fullPath)) {
            // { name: <RegExp>/[a-z]/ }
            if ((pattern as ComplexPattern)[fullPath] instanceof RegExp) {
              if (!((pattern as ComplexPattern)[fullPath] as RegExp).test(value))
                invalidPaths.push(fullPath);
              return;
            }

            // { isValidPassword: <Function>(value: any) => boolean (isValid) }
            if (
              (pattern as ComplexPattern)[fullPath] instanceof Function &&
              !((pattern as ComplexPattern)[fullPath] as PatternArrowFunction).prototype
            ) {
              if (!((pattern as ComplexPattern)[fullPath] as PatternArrowFunction)(value))
                invalidPaths.push(fullPath);
              return;
            }

            // { link: <Constructable>URL }
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

  return invalidPaths.length
    ? outputInvalidPaths
      ? {isValidData: false, invalidPaths}
      : {isValidData: false}
    : {isValidData: true};
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
