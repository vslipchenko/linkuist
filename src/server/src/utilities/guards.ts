import {ApolloError} from 'apollo-server-express';
import {ACCESS_JWT_SECRET} from '../constants/app';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {AccessTokenData} from '../types/jwt/jwt.interfaces';

interface AuthenticationInterceptorResult {
  error: ApolloError;
  tokenData: AccessTokenData;
}

export const authenticationGuard = (
  accessToken: string,
): Promise<AuthenticationInterceptorResult> => {
  // TODO: Get rid of promise as jwt.verify is synchronous
  return new Promise((resolve) => {
    if (!accessToken) {
      return resolve({
        error: new ApolloError('', 'ACCESS_TOKEN_EMPTY'),
      } as AuthenticationInterceptorResult);
    }

    try {
      const tokenData = jwt.verify(accessToken, ACCESS_JWT_SECRET) as AccessTokenData;
      resolve({tokenData} as AuthenticationInterceptorResult);
    } catch (error) {
      // The only legit error
      if (error instanceof TokenExpiredError) {
        return resolve({
          error: new ApolloError('', 'ACCESS_TOKEN_EXPIRED'),
        } as AuthenticationInterceptorResult);
      } else {
        return resolve({
          error: new ApolloError('', 'ACCESS_TOKEN_INVALID'),
        } as AuthenticationInterceptorResult);
      }
    }
  });
};
