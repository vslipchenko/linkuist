const merge = require('lodash/merge');
const {makeExecutableSchema, gql} = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDef = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolver = {
    Query: {
        hello: () => 'Hello world!',
    },
};

module.exports = makeExecutableSchema({
    typeDefs: [typeDef],
    resolvers: merge({}, resolver),
});
