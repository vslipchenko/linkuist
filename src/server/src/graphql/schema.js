const merge = require('lodash/merge');
const {makeExecutableSchema, gql} = require('apollo-server-express');
const {userTypeDefs, userResolvers} = require("./schemas/user/user.schema");

// TODO remove as soon as extend of empty types is available
const rootTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

module.exports = makeExecutableSchema({
    typeDefs: [rootTypeDefs, ...userTypeDefs],
    resolvers: merge(...userResolvers),
});
