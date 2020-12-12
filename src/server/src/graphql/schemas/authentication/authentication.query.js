import {ACCESS_JWT_SECRET, ACCESS_JWT_EXPIRES_IN, REFRESH_JWT_SECRET_FRAGMENT, REFRESH_JWT_EXPIRES_IN} from '../../../constants/app';
const {gql, ApolloError, UserInputError} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../../../models/user');

const signIn = (_, {input}) => {
  if (!input.email) { // TODO OR invalid format
    return new UserInputError('Invalid user data');
  }

  return new Promise((resolve, reject) => {
    User.findOne({email: input.email})
      .then(user => {
        if (!user) {
          return reject(new UserInputError('Invalid user data'));
        }
        // User account is blocked
        if (!user.accessKey) {
          return reject(new ApolloError('User access is restricted', 'USER_BLOCKED'));
        }

        const isCorrectPassword = bcrypt.compareSync(input.password, user.password);
        // Passwords mismatch
        if (!isCorrectPassword) {
          return reject(new UserInputError('Invalid user data'));
        }

        const accessToken = jwt.sign(
          {userId: user._id, username: user.username},
          ACCESS_JWT_SECRET,
          {expiresIn: ACCESS_JWT_EXPIRES_IN}
        );

        const REFRESH_JWT_SECRET = `${REFRESH_JWT_SECRET_FRAGMENT}${user.accessKey}`;

        const refreshToken = jwt.sign(
          {userId: user._id},
          REFRESH_JWT_SECRET,
          {expiresIn: REFRESH_JWT_EXPIRES_IN}
        );
        // OK send back tokens
        return resolve({accessToken, refreshToken});
      }) // Technical error
      .catch(error => reject(error));
  });
};

const accessTokenByRefreshToken = (_, {refreshToken}) => {
  // console.log('refresh token is ', userId);
  if (!refreshToken) {
    return new ApolloError('', 'REFRESH_TOKEN_EMPTY');
  }

  const userId = (jwt.decode(refreshToken) || {}).userId;

  if (!userId) {
    return new ApolloError('', 'REFRESH_TOKEN_INVALID');
  }

  return new Promise((resolve, reject) => {
    User.findOne({_id: userId})
      .then(user => {
        if (!user) {
          return reject(new ApolloError('', 'REFRESH_TOKEN_INVALID'));
        }
        // User account is blocked
        if (!user.accessKey) {
          return reject(new ApolloError('User access is restricted', 'USER_BLOCKED'));
        }

        const REFRESH_JWT_SECRET = `${REFRESH_JWT_SECRET_FRAGMENT}${user.accessKey}`;

        try {
          jwt.verify(refreshToken, REFRESH_JWT_SECRET);
        } catch { // Token is forged or expired
          return reject(new ApolloError('', 'REFRESH_TOKEN_INVALID'));
        }
        // Token is valid
        const accessToken = jwt.sign(
          {userId: user._id, username: user.username},
          ACCESS_JWT_SECRET,
          {expiresIn: ACCESS_JWT_EXPIRES_IN}
        );

        return resolve(accessToken);
      })
      .catch(error => reject(error));
  });
};

const authenticationQueryTypeDefinitions = gql`
    extend type Query {
      signIn(input: SignInQueryInput!): JwtTokens
      accessTokenByRefreshToken(refreshToken: String!): String
    }
`;

const authenticationQueryResolvers = {
  Query: {
    signIn,
    accessTokenByRefreshToken
  }
};

module.exports = {
  authenticationQueryTypeDefinitions,
  authenticationQueryResolvers
};
