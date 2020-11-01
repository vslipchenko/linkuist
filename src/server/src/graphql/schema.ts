const merge = require('lodash/merge');
const {makeExecutableSchema, gql} = require('apollo-server-express');
const {scalarTypeDefinitions, scalarResolvers} = require('./scalars/scalars');
const {authenticationTypeDefinitions, authenticationResolvers} = require("./schemas/authentication/authentication.schema");
const {userTypeDefinitions, userResolvers} = require("./schemas/user/user.schema");

// TODO remove as soon as extend of empty types is available
const rootTypeDefs = gql`
  type Query {
    _: Void
  }

  type Mutation {
    _: Void
  }
`;

export default makeExecutableSchema({
    typeDefs: [
      rootTypeDefs,
      ...scalarTypeDefinitions,
      ...authenticationTypeDefinitions,
      ...userTypeDefinitions
    ],
    resolvers: merge(
      ...scalarResolvers,
      ...authenticationResolvers,
      ...userResolvers
    ),
});
