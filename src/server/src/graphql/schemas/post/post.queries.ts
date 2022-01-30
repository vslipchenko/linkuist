import {gql} from 'apollo-server-express';
import {IPost} from '../../../types/post/post.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
// import {User} from '../../../models/user';
import {Post} from '../../../models/post';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {SortOrder, State} from '../../../types/shared/shared.enums';
import mongoose from 'mongoose';
import {RequestParameters} from '../../../types/shared/shared.types';
import {POST_FETCH_LIMIT} from '../../../constants/post';
import {PostComment} from '../../../models/post-comment';
import {userProfileTeasersByUserIds} from '../user/user.queries';
import {PostStats} from '../../../models/post-stats';
import {authenticationGuard} from '../../../utilities/guards';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
import {PostCommentReply} from '../../../models/post-reply';
// import {getUtcTimestamp} from '../../../utilities/date';
// import {composePostDate} from '../../../utilities/date';

/* Basic post related data retrieval flow:
 * - On each post list load feed back post list with up to date post count
 * Once received by the client, updates the list of posts & post total count
 * (this will allow to load the most recent posts until "Show more posts" button is gone,
 * BUT because it use an offset each time you request a new portion of data, it can preserve stale info state on the client (e.g. posts that were deleted))
 * - On each comment list load for a particular post feed back list of comments with up to date comment count
 * Once received by the client, updates the list of post comments & post comment total count
 * * (this will allow to load the most recent post comments until "Show more comments" button is gone,
 * BUT because it use an offset each time you request a new portion of data, it can preserve stale info state on the client (e.g. posts comments that were deleted))
 * - On each subcomment (reply) list load feed back list of subcomments with up to date subcomment count
 * Once received by the client, updates the list of post subcomments & post subcomment total count
 * * (this will allow to load the most recent post subcomments until "Show more replies" button is gone
 * BUT because it use an offset each time you request a new portion of data, it can contain preserve stale info state on the client (e.g. post subcomments that were deleted))
 * THESE TOTAL COUNT INFO UPDATES HAPPEN ONLY ON SHOW MORE (COMMENTS / REPLIES) ACTION & IGNORED ON COMMENT CREATION / DELETION, ETC
 */

// TODO inspect Post null issue
export const postQueryTypeDefinitions = gql`
  extend type Query {
    postsByUserId(
      userId: String!
      skipProfileTeaserIds: [String]!
      parameters: RequestParameters!
    ): UserPosts!
    # postsByUsername(username: String!, parameters: RequestParameters!): UserPosts!
  }
`;

const aggregatePostData = async (
  userId: string,
  skipProfileTeaserIds: Array<string>,
  parameters: RequestParameters,
  accessToken: string,
): Promise<{
  posts: {data: unknown; total: unknown};
  // postCommentCount: {[postId: string]: number};
  // postCommentCount: Array<{postId: string; count: number}>;
  // userProfileTeasers: {
  //   username: string;
  //   profile: {avatarUrl: string};
  // };
  // totalPostComments: {[postId: string]: number},
  userProfileTeasers: any;
}> => {
  const uniqueUserIdsMap: {[userId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[userId: string]: number} = {};

  skipProfileTeaserIds.forEach((userId) => (skipProfileTeaserIdsMap[userId] = 1));

  const aggregationResult = await Post.aggregate([
    {$match: {userId: new mongoose.Types.ObjectId(userId)}},
    {
      $facet: {
        data: [
          // parameters.limit ? {$limit: parameters.limit} : null,
          parameters.order
            ? {$sort: {createdAt: parameters.order === SortOrder.ASCENDING ? 1 : -1}}
            : null,
          parameters.offset ? {$skip: parameters.offset} : null,
          {$limit: parameters.limit},
        ].filter((stage) => stage), // Filter null
        total: [{$count: 'total'}],
      },
    },
  ]);

  const data = aggregationResult[0].data as Array<
    IPost & {
      totalCommentsSubcomments: number;
      totalComments: number;
      totalDislikes: number;
      totalLikes: number;
      totalShares: number;
      like: State;
    }
  >;
  // const data = aggregationResult[0].data as Array<IPost>;
  // Associative array
  // const postCommentCount: Array<{postId: string; count: number}> = [];
  // const totalPostComments: {[postId: string]: number} = {};

  for (const post of data) {
    // post.date = composePostDate(post.createdAt);
    // console.log('post', post);
    // postCommentCount.push({
    //   postId: post._id,
    //   count: await PostComment.countDocuments({postId: post._id}),
    // });

    // totalPostComments[post.postId] = await PostComment.countDocuments({
    //   postId: post._id,
    //   commentId: {$exists: false}, // do not count subcomments (replies)
    // });

    // TODO move to post-stats.queries
    const postStats = await PostStats.find({postId: post._id});

    let totalLikes = 0;
    let totalDislikes = 0;
    let tokenData: AccessTokenData;

    if (accessToken) {
      // If user is logged in, fetch his post like stat as well
      const {tokenData: decodedTokenData} = authenticationGuard(accessToken);

      if (decodedTokenData) tokenData = decodedTokenData;
    }

    postStats.forEach((stat) => {
      // Check whether request user has liked post
      if (tokenData && stat.userId.toString() === tokenData.userId) post.like = stat.like;
      if (stat.like === State.YES) return totalLikes++;
      totalDislikes++; // case: State.NO
    });

    post.totalLikes = totalLikes;
    post.totalDislikes = totalDislikes;
    post.totalShares = await Post.countDocuments({
      postId: post._id,
    });

    // totalComments results already contain data totalCommentsSubcomments, thus countDocuments can be dropped in favor of find() with further local processing
    post.totalComments = await PostComment.countDocuments({
      postId: post._id,
    });
    post.totalCommentsSubcomments = await postCommentSubcommentTotalCount(post._id);

    // Might be optimized as post might have only one owner (profile owner); others teaser data relevance may be sacrificed
    const userId = post.userId.toString();

    if (!uniqueUserIdsMap[userId] && !skipProfileTeaserIdsMap[userId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[userId] = 1;
    }
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);
  // console.log('uniqueUserIds ', uniqueUserIds, skipProfileTeaserIds, new Date());
  // console.log('====================================');

  // const userProfileTeasers = uniqueUserIds.length
  //   ? await User.find(
  //       {
  //         _id: {
  //           $in: uniqueUserIds.map((id) => new mongoose.Types.ObjectId(id)),
  //         },
  //       },
  //       'username profile.avatarUrl',
  //     )
  //   : [];

  // console.log('HERE', {
  //   posts: {
  //     data: data,
  //     total: aggregationResult[0].total.length ? aggregationResult[0].total[0].total : 0,
  //   },
  //   postCommentCount,
  //   userProfileTeasers,
  // });

  return {
    posts: {
      data,
      total: aggregationResult[0].total.length ? aggregationResult[0].total[0].total : 0,
    },
    // totalPostComments,
    // postCommentCount,
    userProfileTeasers: userProfileTeasersByUserIds(uniqueUserIds),
  };
};

const postsByUserId = (
  _: unknown,
  {
    userId,
    skipProfileTeaserIds,
    parameters,
  }: {
    userId: ILinkard['userId'];
    skipProfileTeaserIds: Array<string>;
    parameters: RequestParameters;
  },
  {accessToken}: {accessToken: string},
): Promise<{posts: {data: unknown; total: unknown}; userProfileTeasers: Array<unknown>}> | null => {
  const {isInvalidData} = checkDataValidity({
    data: {userId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      userId: RECORD_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isInteger,
      limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_FETCH_LIMIT,
    },
  });

  if (isInvalidData) {
    return null;
  }

  return aggregatePostData(userId, skipProfileTeaserIds, parameters, accessToken);
};

export const postCommentSubcommentTotalCount = async (postId: string): Promise<number> => {
  const commentCount = await PostComment.countDocuments({
    postId,
  }).exec();

  if (!commentCount) return 0;

  const replyCount = await PostCommentReply.countDocuments({
    postId,
  }).exec();

  return commentCount + replyCount;
};

// const postsByUsername = async (
//   _: unknown,
//   {username, parameters}: {username: IUser['username']; parameters: RequestParameters},
// ): Promise<
//   | Array<MongooseDocument<IPost>>
//   | {posts: {data: any; total: any}; userProfileTeasers: Array<unknown>}
//   | UserInputError
//   | null
// > => {
//   const {isInvalidData} = checkDataValidity({
//     data: {username, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
//     ignoreUndefinedValuePaths: ['order', 'offset'],
//     pattern: {
//       username: USERNAME_REGEXP,
//       order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
//       offset: Number.isInteger,
//       limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_FETCH_LIMIT,
//     },
//   });
//
//   if (isInvalidData) return null;
//   // TODO Consider to pull only required data
//   const user = await User.findOne({
//     username,
//   });
//
//   if (!user) return new UserInputError('Invalid username');
//
//   return aggregatePostData(user._id, parameters);
// };

export const postQueryResolvers = {
  Query: {
    postsByUserId,
    // postsByUsername,
  },
};
