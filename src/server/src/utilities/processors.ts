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

const kek = Boolean(0);
