import {gql} from 'apollo-server-express';
import {EMAIL_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {IUser} from '../../../types/user/user.interfaces';
import {checkDataValidity} from '../../../utilities/validators';

const userByEmail = (_: unknown, {email}: {email: IUser['email']}): unknown => {
  if (checkDataValidity({input: email, pattern: EMAIL_REGEXP})) {
    return User.findOne({email});
  }
};

const userByUsername = (_: unknown, {username}: {username: IUser['username']}): unknown => {
  if (checkDataValidity({input: username, pattern: USERNAME_REGEXP})) {
    return User.findOne({username});
  }
};

export const userQueryTypeDefinitions = gql`
  extend type Query {
    userByEmail(email: String!): User
    userByUsername(username: String!): User
  }
`;

export const userQueryResolvers = {
  Query: {
    userByEmail,
    userByUsername,
  },
};
