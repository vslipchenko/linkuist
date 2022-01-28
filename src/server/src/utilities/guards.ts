import {ApolloError} from 'apollo-server-express';
import {ACCESS_JWT_SECRET} from '../constants/app';
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {AccessTokenData} from '../types/jwt/jwt.interfaces';

interface AuthenticationInterceptorResult {
  error: ApolloError;
  tokenData: AccessTokenData;
}

export const authenticationGuard = (accessToken: string): AuthenticationInterceptorResult => {
  if (!accessToken) {
    return {
      error: new ApolloError('', 'ACCESS_TOKEN_EMPTY'),
    } as AuthenticationInterceptorResult;
  }

  try {
    const tokenData = jwt.verify(accessToken, ACCESS_JWT_SECRET) as AccessTokenData;
    return {tokenData} as AuthenticationInterceptorResult;
  } catch (error) {
    // The only legit error
    if (error instanceof TokenExpiredError) {
      return {
        error: new ApolloError('', 'ACCESS_TOKEN_EXPIRED'),
      } as AuthenticationInterceptorResult;
    } else {
      return {
        error: new ApolloError('', 'ACCESS_TOKEN_INVALID'),
      } as AuthenticationInterceptorResult;
    }
  }
};
