import {gql} from 'apollo-server-express';
import {IPost} from '../../../types/post/post.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
// import {User} from '../../../models/user';
import {Post} from '../../../models/post';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {SortOrder} from '../../../types/shared/shared.enums';
import mongoose from 'mongoose';
import {RequestParameters} from '../../../types/shared/shared.types';
import {POST_FETCH_LIMIT} from '../../../constants/post';
import {PostComment} from '../../../models/post-comment';
import {userProfileTeasersByUserIds} from '../user/user.queries';
// import {getUtcTimestamp} from '../../../utilities/date';
// import {composePostDate} from '../../../utilities/date';

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
): Promise<{
  posts: {data: unknown; total: unknown};
  // postCommentCount: {[postId: string]: number};
  // postCommentCount: Array<{postId: string; count: number}>;
  // userProfileTeasers: {
  //   username: string;
  //   profile: {avatarUrl: string};
  // };
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

  const data = aggregationResult[0].data as Array<IPost & {commentCount: number}>;
  // Associative array
  // const postCommentCount: Array<{postId: string; count: number}> = [];

  for (const post of data) {
    // post.date = composePostDate(post.createdAt);
    // console.log('post', post);
    // postCommentCount.push({
    //   postId: post._id,
    //   count: await PostComment.countDocuments({postId: post._id}),
    // });

    post.commentCount = await PostComment.countDocuments({postId: post._id});
    // post.userId is of type mongoose ObjectId;
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

  return aggregatePostData(userId, skipProfileTeaserIds, parameters);
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
