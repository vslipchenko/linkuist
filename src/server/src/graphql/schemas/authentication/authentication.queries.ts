import {
  ACCESS_JWT_EXPIRES_IN,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_EXPIRES_IN,
  REFRESH_JWT_SECRET_FRAGMENT,
} from '../../../constants/app';
import {ApolloError, gql, UserInputError} from 'apollo-server-express';
import jwt, {SignOptions} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {EMAIL_REGEXP, PASSWORD_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {IUser} from '../../../types/user/user.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {RefreshAccessTokenPayload} from '../../../types/jwt/jwt.interfaces';
import {MongooseDocument, MongooseQueryResult} from '../../../types/mongoose/mongoose.types';

const signIn = (_: unknown, {input}: {input: IUser}): any => {
  const {isInvalidData} = checkDataValidity({
    data: input,
    pattern: {
      email: EMAIL_REGEXP,
      password: PASSWORD_REGEXP,
    },
  });

  if (isInvalidData) {
    return null;
  }

  return new Promise((resolve, reject) => {
    User.findOne({email: input.email})
      .then((user: MongooseQueryResult<MongooseDocument<IUser>>) => {
        if (!user) {
          return reject(new UserInputError('Invalid user credentials'));
        }

        // User account is blocked
        if (!user.accessKey) {
          return reject(new ApolloError('User access is restricted', 'USER_BLOCKED'));
        }

        const isCorrectPassword = bcrypt.compareSync(input.password, user.password);
        // Passwords mismatch
        if (!isCorrectPassword) {
          return reject(new UserInputError('Invalid user credentials'));
        }

        const accessToken = jwt.sign(
          {userId: user._id, username: user.username},
          ACCESS_JWT_SECRET,
          {expiresIn: ACCESS_JWT_EXPIRES_IN} as SignOptions,
        );

        const REFRESH_JWT_SECRET = `${REFRESH_JWT_SECRET_FRAGMENT}${user.accessKey}`;

        const refreshToken = jwt.sign({userId: user._id}, REFRESH_JWT_SECRET, {
          expiresIn: REFRESH_JWT_EXPIRES_IN,
        } as SignOptions);
        // OK send back tokens
        return resolve({accessToken, refreshToken});
      }) // Technical error
      .catch((error) => reject(error));
  });
};

const accessTokenByRefreshToken = (_: unknown, {refreshToken}: {refreshToken: string}): any => {
  // console.log('refresh token is ', userId);
  if (!refreshToken) {
    return new ApolloError('', 'REFRESH_TOKEN_EMPTY');
  }

  const userId = (jwt.decode(refreshToken) as RefreshAccessTokenPayload)?.userId;

  if (!userId) {
    return new ApolloError('', 'REFRESH_TOKEN_INVALID');
  }

  return new Promise((resolve, reject) => {
    User.findOne({_id: userId})
      .then((user: MongooseQueryResult<MongooseDocument<IUser>>) => {
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
        } catch {
          // Token is forged or expired
          return reject(new ApolloError('', 'REFRESH_TOKEN_INVALID'));
        }
        // Token is valid
        const accessToken = jwt.sign(
          {userId: user._id, username: user.username},
          ACCESS_JWT_SECRET,
          {expiresIn: ACCESS_JWT_EXPIRES_IN} as SignOptions,
        );

        return resolve(accessToken);
      })
      .catch((error) => reject(new ApolloError(error)));
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
    accessTokenByRefreshToken,
  },
};
