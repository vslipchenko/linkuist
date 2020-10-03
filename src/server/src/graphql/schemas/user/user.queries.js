const {ACCESS_JWT_SECRET, ACCESS_JWT_EXPIRES_IN, REFRESH_JWT_SECRET_FRAGMENT, REFRESH_JWT_EXPIRES_IN} = require('../../../constants/app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {gql} = require('apollo-server-express');
const {User} = require('../../../models/user');
const {UserInputError, ForbiddenError} = require('apollo-server-express');

const signIn = (_, {input}) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: input.email})
      .then(({_id, username, password, accessKey}) => {
        const isCorrectPassword = bcrypt.compareSync(input.password, password);
        // Passwords mismatch
        if (!isCorrectPassword) {
          return reject(new UserInputError('Invalid user data'));
        }
        // User account is blocked
        if (!accessKey) {
          return reject(new ForbiddenError('User has no access'));
        }

        const accessToken = jwt.sign(
          {userId: _id, username},
          ACCESS_JWT_SECRET,
          {expiresIn: ACCESS_JWT_EXPIRES_IN}
        );

        const REFRESH_JWT_SECRET = `${REFRESH_JWT_SECRET_FRAGMENT}${accessKey}`;

        const refreshToken = jwt.sign(
          {userId: _id},
          REFRESH_JWT_SECRET,
          {expiresIn: REFRESH_JWT_EXPIRES_IN}
        );
        // OK send back tokens
        resolve({accessToken, refreshToken});
      })
      .catch(error => reject(error));
  });
};

const userByEmail = (_, {email}) => {
  return User.findOne({email});
};

const userByUsername = (_, {username}) => {
  return User.findOne({username});
};

const userQueryTypeDefs = gql`
    extend type Query {
      signIn(input: SignInQueryInput!): JwtTokens
      userByEmail(email: String!): User
      userByUsername(username: String!): User
    }
`;

const userQueryResolvers = {
  Query: {
    signIn,
    userByEmail,
    userByUsername
  }
};

module.exports = {
  userQueryTypeDefs,
  userQueryResolvers
}
