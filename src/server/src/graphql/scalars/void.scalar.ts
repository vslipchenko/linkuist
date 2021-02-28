import {GraphQLScalarType} from 'graphql';
import {gql} from 'apollo-server-express';

export const VoidTypeDefinition = gql`
  scalar Void
`;

export const VoidResolver = new GraphQLScalarType({
  name: 'Void',

  description: 'Represents VOID return type',

  serialize(): null {
    return null;
  },

  parseValue(): null {
    return null;
  },

  parseLiteral(): null {
    return null;
  },
});
