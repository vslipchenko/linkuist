import {UrlMatchResult, UrlSegment} from '@angular/router';
import {URL_USERNAME_REGEXP} from '@constants/validation';

// export const userPageUrlMatcher = (segments: UrlSegment[]): UrlMatchResult | null => {
//   const hasOnlyOneSegment = segments.length === 1;
//   const isValidUrl = URL_USERNAME_REGEXP.test(segments[0]?.path);
//
//   return hasOnlyOneSegment && isValidUrl ? {consumed: segments} : null;
// };

export const urlMatcher = (pathMatches: Array<string | RegExp>)
  : (segments: UrlSegment[]) => null | UrlMatchResult => {
  return (segments: UrlSegment[]) => {
    if (segments.length === pathMatches.length) {
      let result = {consumed: segments};

      pathMatches.forEach((item, index) => {
        const matchAgainst = segments[index]?.path;
        if (
          (typeof item === 'string' && item === matchAgainst)
          || ((item instanceof RegExp) && item.test(matchAgainst))
        ) {
          //continue
        } else {
          return result = null;
        }
      });
      return result;
    }
    return null;
  };
};

export const extractUsername = (input: string): string | null => {
  const result = URL_USERNAME_REGEXP.exec(input);

  if (result && result[0]) {
    return result[0].slice(1);// skip '@' char
  }

  return null;
};
