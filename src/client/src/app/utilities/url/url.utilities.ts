import {UrlMatchResult, UrlSegment} from '@angular/router';
import {URL_USERNAME_REGEXP} from '../../constants/validation';

export const userPageUrlMatcher = (segments: UrlSegment[]): UrlMatchResult | null => {
  const hasOnlyOneSegment = segments.length === 1;
  const isValidUrl = URL_USERNAME_REGEXP.test(segments[0]?.path);

  return hasOnlyOneSegment && isValidUrl ? {consumed: segments} : null;
};

export const extractUsername = (input: string): string | null => {
  const result = URL_USERNAME_REGEXP.exec(input);

  if (!result || !result[0]) {
    return null;
  }

  const username = result[0].slice(1); // skip '@' char

  return username;
};
