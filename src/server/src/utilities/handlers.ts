import {ACCESS_JWT_SECRET} from '../constants/app';
import {ApolloError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';

export const authenticationHandler = (
  accessToken: string,
  successCallback: (tokenData: string | object) => unknown
) => {
  if (!accessToken) {
    return new ApolloError('', 'ACCESS_TOKEN_EMPTY');
  }

  return new Promise((resolve, reject) => {
    let tokenData;

    try {
      tokenData = jwt.verify(accessToken, ACCESS_JWT_SECRET);
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
