import {gql} from 'apollo-server-express';
import {User} from '../../../models/user';
import {UserInterface} from '../../../types/user/user.interfaces';

const userByEmail = (_: unknown, {email}: {email: UserInterface['email']}) => {
  return User.findOne({email});
};

const userByUsername = (_: unknown, {username}: {username: UserInterface['username']}) => {
  return User.findOne({username});
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
    userByUsername
  }
};
