import {merge as _merge} from 'lodash';
import {gql, makeExecutableSchema} from 'apollo-server-express';
import {scalarResolvers, scalarTypeDefinitions} from './scalars/scalars';
import {
  authenticationResolvers,
  authenticationTypeDefinitions,
} from './schemas/authentication/authentication.schema';
import {bookmarkResolvers, bookmarkTypeDefinitions} from './schemas/bookmark/bookmark.schema';
import {userTypeDefinitions, userResolvers} from './schemas/user/user.schema';

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
    ...userTypeDefinitions,
    ...bookmarkTypeDefinitions,
  ],
  resolvers: _merge(
    {},
    ...scalarResolvers,
    ...authenticationResolvers,
    ...userResolvers,
    ...bookmarkResolvers,
  ),
});
