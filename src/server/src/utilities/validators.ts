interface CheckDataValidityOptions {
  payload: any;
  pattern: RegExp | { [key: string]: RegExp };
  pathsToCheck?: string[];
  outputInvalidPaths?: boolean;
}

type CheckDataValidityResult = boolean | [boolean, string[]];

export const checkDataValidity = ({payload, pattern, pathsToCheck = [], outputInvalidPaths = false}: CheckDataValidityOptions): CheckDataValidityResult => {
  const invalidPaths: string[] = [];

  const validateRecursively = (value: any, path: string[] = []): void => {
    if (value instanceof Object) {
      // allows to validate arrays and objects with non-numeric keys
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const currentPath: string[] = [...path];
          // omit numeric keys in path, e.g., instead of pathsToCheck = ['key.0', 'key.1'] it would be pathsToCheck = ['key']
          isNaN(Number(key)) && currentPath.push(key);

          validateRecursively(value[key], currentPath);
        }
      }
    } else {
      const fullPath = path.join('.');
      if (!pathsToCheck.length || pathsToCheck.includes(fullPath)) {
        // if its a distinct entry & standalone pattern or path patterns are provided & value is invalid
        // @ts-ignore
        !invalidPaths.includes(fullPath) && (pattern.constructor === RegExp ? !pattern.test(value) : pattern[fullPath] && !pattern[fullPath].test(value)) && invalidPaths.push(fullPath);
      }
    }
  };

  validateRecursively(payload);

  return invalidPaths.length
    ? outputInvalidPaths
      ? [false, invalidPaths]
      : false
    : true;
};
