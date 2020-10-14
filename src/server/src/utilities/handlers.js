const {ApolloError} = require('apollo-server-express');
const {ACCESS_JWT_SECRET} = require('../constants/app');
const jwt = require('jsonwebtoken');

const authenticationHandler = (accessToken, successCallback) => {
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

module.exports = {
  authenticationHandler
};
