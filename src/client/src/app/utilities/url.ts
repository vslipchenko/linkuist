import {UrlMatchResult, UrlSegment} from '@angular/router';
import {URL_USERNAME_REGEXP} from '~app/constants/regexps';

export const urlMatcher = (
  paths: Array<string | RegExp>,
): ((segments: Array<UrlSegment>) => null | UrlMatchResult) => {
  return (segments: Array<UrlSegment>): null | UrlMatchResult => {
    if (segments.length === paths.length) {
      const result: UrlMatchResult = {consumed: segments};

      for (let i = 0; i < paths.length; i++) {
        const matchAgainst = segments[i]?.path;
        const path = paths[i];

        // @ts-expect-error
        if (path[0] === ':') {
          // resolve dynamic parameters, e.g. :id
          if (!result.posParams) result.posParams = {};
          // @ts-expect-error
          result.posParams[path.slice(1)] = new UrlSegment(matchAgainst, {});
          continue;
        }

        if (
          (typeof path === 'string' && path === matchAgainst) ||
          (path instanceof RegExp && path.test(matchAgainst))
        ) {
          continue;
        }

        return null;
      }

      return result;
    }

    return null;
  };
};

export const extractUsername = (input: string): string | null => {
  const result = URL_USERNAME_REGEXP.exec(input);

  if (result && result[0]) {
    return result[0].slice(1); // skip '@' char
  }

  return null;
};
