import {merge as _merge} from 'lodash';
import {gql} from 'apollo-server-express';
import {scalarResolvers, scalarTypeDefinitions} from './scalars/scalars';
import {
  authenticationResolvers,
  authenticationTypeDefinitions,
} from './schemas/authentication/authentication.schema';
import {linkardResolvers, linkardTypeDefinitions} from './schemas/linkard/linkard.schema';
import {userTypeDefinitions, userResolvers} from './schemas/user/user.schema';
import {postResolvers, postTypeDefinitions} from './schemas/post/post.schema';
// import {profileResolvers, profileTypeDefinitions} from './schemas/_profile/profile.schema';
import {sharedResolvers, sharedTypeDefinitions} from './schemas/shared/shared.schema';
import {
  postCommentResolvers,
  postCommentTypeDefinitions,
} from './schemas/post-comment/post-comment.schema';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {postReplyResolvers, postReplyTypeDefinitions} from './schemas/post-reply/post-reply.schema';
import {postStatsResolvers, postStatsTypeDefinitions} from './schemas/post-stats/post-stats.schema';
import {
  postCommentStatsResolvers,
  postCommentStatsTypeDefinitions,
} from './schemas/post-comment-stats/post-comment-stats.schema';
import {
  postReplyStatsResolvers,
  postReplyStatsTypeDefinitions,
} from './schemas/post-reply-stats/post-reply-stats.schema';

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
    ...sharedTypeDefinitions,
    ...scalarTypeDefinitions,
    ...authenticationTypeDefinitions,
    ...userTypeDefinitions,
    ...postTypeDefinitions,
    ...postCommentTypeDefinitions,
    ...postReplyTypeDefinitions,
    ...linkardTypeDefinitions,
    ...postStatsTypeDefinitions,
    ...postCommentStatsTypeDefinitions,
    ...postReplyStatsTypeDefinitions,
    // ...profileTypeDefinitions,
  ],
  resolvers: _merge(
    {},
    ...sharedResolvers,
    ...scalarResolvers,
    ...authenticationResolvers,
    ...userResolvers,
    ...postResolvers,
    ...postCommentResolvers,
    ...postReplyResolvers,
    ...linkardResolvers,
    ...postStatsResolvers,
    ...postCommentStatsResolvers,
    ...postReplyStatsResolvers,
    // ...profileResolvers,
  ),
  // resolvers: {
  //   ...scalarResolvers,
  //   ...authenticationResolvers,
  //   ...userResolvers,
  //   ...postResolvers,
  //   ...linkardResolvers,
  //   ...profileResolvers,
  // },
});
