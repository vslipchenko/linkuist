import {ACCESS_JWT_EXPIRES_IN, ACCESS_JWT_SECRET, REFRESH_JWT_EXPIRES_IN, REFRESH_JWT_SECRET_FRAGMENT} from '../../../constants/app';
import {ApolloError, gql, UserInputError} from 'apollo-server-express';
import jwt, {SignOptions} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from '../../../models/user';
import {UserDocument, IUser} from '../../../types/user/user.interfaces';
import {QueryResult} from '../../../types/mongoose/mongoose.types';
import {RefreshAccessTokenPayload} from '../../../types/jwt/jwt.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {EMAIL_REGEXP, PASSWORD_REGEXP} from '../../../constants/validation';

const signIn = (_: unknown, {input}: { input: IUser }) => {
  const isValidData = checkDataValidity({input, pattern: {
    'email': EMAIL_REGEXP,
    'password': PASSWORD_REGEXP
  }});

  if (!isValidData) {
    return null;
  }

  return new Promise((resolve, reject) => {
    User.findOne({email: input.email})
      .then((user: QueryResult<UserDocument>) => {
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
          {expiresIn: ACCESS_JWT_EXPIRES_IN} as SignOptions
        );

        const REFRESH_JWT_SECRET = `${REFRESH_JWT_SECRET_FRAGMENT}${user.accessKey}`;

        const refreshToken = jwt.sign(
          {userId: user._id},
          REFRESH_JWT_SECRET,
          {expiresIn: REFRESH_JWT_EXPIRES_IN} as SignOptions
        );
        // OK send back tokens
        return resolve({accessToken, refreshToken});
      }) // Technical error
      .catch(error => reject(error));
  });
};

const accessTokenByRefreshToken = (_: unknown, {refreshToken}: { refreshToken: string }) => {
  // console.log('refresh token is ', userId);
  if (!refreshToken) {
    return new ApolloError('', 'REFRESH_TOKEN_EMPTY');
  }

  const userId = (<RefreshAccessTokenPayload>jwt.decode(refreshToken))?.userId;

  if (!userId) {
    return new ApolloError('', 'REFRESH_TOKEN_INVALID');
  }

  return new Promise((resolve, reject) => {
    User.findOne({_id: userId})
      .then((user: QueryResult<UserDocument>) => {
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
          {expiresIn: ACCESS_JWT_EXPIRES_IN} as SignOptions
        );

        return resolve(accessToken);
      })
      .catch(error => reject(error));
  });
};

export const authenticationQueryTypeDefinitions = gql`
    extend type Query {
      signIn(input: SignInQueryInput!): JwtTokens
      accessTokenByRefreshToken(refreshToken: String!): String
    }
`;

export const authenticationQueryResolvers = {
  Query: {
    signIn,
    accessTokenByRefreshToken
  }
};
