export const parseCliFlagValue = (flagName: string): string | undefined => {
  const flag = process.argv.find((argument) => argument.indexOf(`-${flagName}=`) > -1);

  if (flag) {
    return flag.slice(flag.indexOf('=') + 1);
  }

  return undefined;
};

export const parseUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};
