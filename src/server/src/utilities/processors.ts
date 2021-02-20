export const replaceExcessiveIndents = (input: string, replaceValue: string): string => {
  // leave only singular whitespaces
  return input.replace(/[\r\n\t]|(\s\s+)/g, replaceValue);
};

export const forEachMatch = (
  input: string,
  regexp: RegExp,
  callback: (match: string) => false | void,
): void => {
  let match;
  regexp = RegExp(regexp, 'g');

  while ((match = regexp.exec(input)) !== null) {
    const continueLoop = callback(match[0]);
    if (continueLoop === false) {
      break;
    }
  }
};
