import {merge as _merge} from 'lodash';
import {gql, makeExecutableSchema} from 'apollo-server-express';
import {scalarResolvers, scalarTypeDefinitions} from './scalars/scalars';
import {
  authenticationResolvers,
  authenticationTypeDefinitions,
} from './schemas/authentication/authentication.schema';
import {linkardResolvers, linkardTypeDefinitions} from './schemas/linkard/linkard.schema';
import {userTypeDefinitions, userResolvers} from './schemas/user/user.schema';
import {postResolvers, postTypeDefinitions} from './schemas/post/post.schema';

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
    ...postTypeDefinitions,
    ...linkardTypeDefinitions,
  ],
  resolvers: _merge(
    {},
    ...scalarResolvers,
    ...authenticationResolvers,
    ...userResolvers,
    ...postResolvers,
    ...linkardResolvers,
  ),
});
