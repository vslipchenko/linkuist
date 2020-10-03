const merge = require('lodash/merge');
const {makeExecutableSchema, gql} = require('apollo-server-express');
const {scalarTypeDefs, scalarResolvers} = require('./scalars/scalars');
const {userTypeDefs, userResolvers} = require("./schemas/user/user.schema");

// TODO remove as soon as extend of empty types is available
const rootTypeDefs = gql`
  type Query {
    _: Void
  }

  type Mutation {
    _: Void
  }
`;

module.exports = makeExecutableSchema({
    typeDefs: [
      rootTypeDefs,
      ...scalarTypeDefs,
      ...userTypeDefs
    ],
    resolvers: merge(
      ...scalarResolvers,
      ...userResolvers
    ),
});
