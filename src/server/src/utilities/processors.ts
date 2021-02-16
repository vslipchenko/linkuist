export const replaceExcessiveIndents = (input: string, replaceValue: string): string => { // leave only singular whitespaces
  return input.replace(/[\r\n\t]|(\s\s+)/g, replaceValue);
};

export const forEachMatch = (input: string, regexp: RegExp, callback: (match: string) => false | void): void => {
  const matches = input.match(RegExp(regexp, 'g')); // alternative to matchAll()

  if (!matches) return;

  if (matches) {
    for (const match of matches) {
      const continueLoop = callback(match);
      if (continueLoop === false) break;
    }
  }
};
