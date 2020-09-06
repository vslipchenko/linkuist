const merge = require('lodash/merge');
const {userInputs} = require("./user/user.inputs");
const {userTypes} = require('./user/user.types');
const {userMutationTypes, userMutationResolvers} = require('./user/user.mutations');
const {makeExecutableSchema, gql} = require('apollo-server-express');

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
    typeDefs: [rootTypeDefs, userTypes, userInputs, userMutationTypes],
    resolvers: merge({}, userMutationResolvers),
});
