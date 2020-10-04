const {gql} = require('apollo-server-express');
const {User} = require('../../../models/user');

const userByEmail = (_, {email}) => {
  return User.findOne({email});
};

const userByUsername = (_, {username}) => {
  return User.findOne({username});
};

const userQueryTypeDefinitions = gql`
    extend type Query {
      userByEmail(email: String!): User
      userByUsername(username: String!): User
    }
`;

const userQueryResolvers = {
  Query: {
    userByEmail,
    userByUsername
  }
};

module.exports = {
  userQueryTypeDefinitions,
  userQueryResolvers
}
