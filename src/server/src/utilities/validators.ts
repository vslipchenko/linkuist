interface CheckDataValidityOptions {
  input: unknown;
  pattern: RegExp | Record<string, RegExp>;
  pathsToCheck?: Array<string>;
  outputInvalidPaths?: boolean;
}

type CheckDataValidityResult = boolean | [boolean, Array<string>];

export const checkDataValidity = ({
  input,
  pattern,
  pathsToCheck = [],
  outputInvalidPaths = false,
}: CheckDataValidityOptions): CheckDataValidityResult => {
  const invalidPaths: Array<string> = [];

  const validateRecursively = (value: any, path: Array<string> = []): void => {
    if (value instanceof Object) {
      // allows to validate arrays and objects with non-numeric keys
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const currentPath: Array<string> = [...path];
          // omit numeric keys in path, e.g., instead of pathsToCheck = ['key.0', 'key.1'] it would be pathsToCheck = ['key']
          isNaN(Number(key)) && currentPath.push(key);

          validateRecursively(value[key], currentPath);
        }
      }
    } else {
      const fullPath = path.join('.');
      if (!pathsToCheck.length || pathsToCheck.includes(fullPath)) {
        // if its a distinct entry & standalone pattern or path patterns are provided & value is invalid
        !invalidPaths.includes(fullPath) &&
          (pattern instanceof RegExp
            ? !pattern.test(value)
            : pattern.hasOwnProperty(fullPath) && !pattern[fullPath].test(value)) &&
          invalidPaths.push(fullPath);
      }
    }
  };

  validateRecursively(input);

  return invalidPaths.length ? (outputInvalidPaths ? [false, invalidPaths] : false) : true;
};

// export const getComposedRegExp = (regExps: RegExp[], flags?: string): RegExp => {
//   return RegExp(regExps.map(regExp => regExp.source).join("|"), flags);
// };
