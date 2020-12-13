import {merge as _merge} from 'lodash';
import {makeExecutableSchema, gql} from 'apollo-server-express';
import {scalarTypeDefinitions, scalarResolvers} from './scalars/scalars';
import {authenticationTypeDefinitions, authenticationResolvers} from './schemas/authentication/authentication.schema';
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
    resolvers: _merge(
      {},
      ...scalarResolvers,
      ...authenticationResolvers,
      ...userResolvers
    ),
});
