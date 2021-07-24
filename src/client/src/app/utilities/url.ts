import {UrlMatchResult, UrlSegment} from '@angular/router';

type PathsMatchAgainst = Array<string | RegExp>;
type UrlMatcherResult = (segments: Array<UrlSegment>) => null | UrlMatchResult;
type PathsMatchPayload = {paths: Array<string>; testAgainst: PathsMatchAgainst};

export const urlMatcher = (payload: PathsMatchAgainst): UrlMatcherResult => {
  return (segments: Array<UrlSegment>): null | UrlMatchResult => {
    if (segments.length === payload.length) {
      const result: UrlMatchResult = {consumed: segments};

      for (let i = 0; i < payload.length; i++) {
        const matchAgainst = segments[i].path;
        const path = payload[i];

        // @ts-expect-error
        if (path[0] === ':') {
          // resolve dynamic parameters, e.g. :id
          if (!result.posParams) result.posParams = {};
          // @ts-expect-error
          result.posParams[path.slice(1)] = new UrlSegment(matchAgainst, {});
          continue;
        }

        if (
          (typeof path === 'string' && path !== matchAgainst) ||
          (path instanceof RegExp && !path.test(matchAgainst))
        ) {
          return null;
        }
      }

      return result;
    }

    return null;
  };
};

export const multiUrlMatcher = (payload: Array<PathsMatchAgainst>): UrlMatcherResult => {
  return (segments: Array<UrlSegment>): null | UrlMatchResult => {
    let consumedSegments;

    for (let i = 0; i < payload.length; i++) {
      const path = payload[i];
      consumedSegments = urlMatcher(path)(segments);
      if (consumedSegments) return consumedSegments;
    }

    return null;
  };
};

export const pathsMatch = (payload: PathsMatchPayload): boolean => {
  const {paths, testAgainst} = payload;
  if (paths.length !== testAgainst.length) return false;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const testAgainstExpression = testAgainst[i];

    if (
      (typeof testAgainstExpression === 'string' && testAgainstExpression !== path) ||
      (testAgainstExpression instanceof RegExp && !testAgainstExpression.test(path))
    ) {
      return false;
    }
  }

  return true;
};

// export const extractUsername = (input: string): string | null => {
//   const result = URL_USERNAME_REGEXP.exec(input);
//
//   if (result && result[0]) {
//     return result[0].slice(1); // skip '@' char
//   }
//
//   return null;
// };
