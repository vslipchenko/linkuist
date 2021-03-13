import {ACCESS_JWT_SECRET} from '@constants/app';
import {ApolloError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import {AccessTokenData} from '@typings/jwt/jwt.interfaces';

export const authenticationInterceptor = <C = unknown>(
  accessToken: string,
  successCallback: (tokenData: AccessTokenData) => C,
): ApolloError | Promise<ApolloError | C> => {
  if (!accessToken) {
    return new ApolloError('', 'ACCESS_TOKEN_EMPTY');
  }

  return new Promise((resolve, reject) => {
    let tokenData;

    try {
      tokenData = jwt.verify(accessToken, ACCESS_JWT_SECRET) as AccessTokenData;
    } catch (error) {
      // The only legit error
      if (error.name === 'TokenExpiredError') {
        return reject(new ApolloError('', 'ACCESS_TOKEN_EXPIRED'));
      } else {
        return reject(new ApolloError('', 'ACCESS_TOKEN_INVALID'));
      }
    }

    return resolve(successCallback(tokenData));
  });
};
