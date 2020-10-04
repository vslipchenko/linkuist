const {GraphQLScalarType} = require('graphql');
const {gql} = require('apollo-server-express');

const VoidTypeDefinition = gql`
  scalar Void
`;

const VoidResolver = new GraphQLScalarType({
  name: 'Void',

  description: 'Represents VOID return type',

  serialize() {
    return null
  },

  parseValue() {
    return null
  },

  parseLiteral() {
    return null
  }
})

module.exports = {
  VoidTypeDefinition,
  VoidResolver
};
