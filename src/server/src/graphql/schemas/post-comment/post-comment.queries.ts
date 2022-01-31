import {gql} from 'apollo-server-express';
import {RequestParameters} from '../../../types/shared/shared.types';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {SortOrder, State} from '../../../types/shared/shared.enums';
import {POST_COMMENT_FETCH_LIMIT} from '../../../constants/post';
import mongoose from 'mongoose';
import {PostComment} from '../../../models/post-comment';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {userProfileTeasersByUserIds} from '../user/user.queries';
import {PostCommentReply} from '../../../models/post-reply';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {PostCommentStats} from '../../../models/post-comment-stats';

export const postCommentQueryTypeDefinitions = gql`
  extend type Query {
    postCommentsByPostId(
      postId: String!
      skipPostCommentIds: [String]!
      skipProfileTeaserIds: [String]!
      parameters: RequestParameters!
    ): UserPostComments!
  }
`;

const aggregatePostCommentData = async (
  postId: string,
  skipPostCommentIds: Array<string>,
  skipProfileTeaserIds: Array<string>,
  parameters: RequestParameters,
  accessToken: string,
): Promise<unknown> => {
  const uniqueUserIdsMap: {[userId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[userId: string]: number} = {};

  skipProfileTeaserIds.forEach((userId) => (skipProfileTeaserIdsMap[userId] = 1));

  const aggregationResult = await PostComment.aggregate([
    {
      $match: {
        _id: {$nin: skipPostCommentIds.map((id) => new mongoose.Types.ObjectId(id))}, // do not lookup for recently added comments in order to avoid duplicate entry & wrong results
        postId: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $facet: {
        data: [
          // parameters.limit ? {$limit: parameters.limit} : null,
          parameters.order
            ? {$sort: {createdAt: parameters.order === SortOrder.ASCENDING ? 1 : -1}}
            : null,
          parameters.offset ? {$skip: parameters.offset} : null,
          {$limit: parameters.limit},
        ].filter((stage) => stage), // Filter null,
        // total: [{$count: 'total'}],
      },
    },
  ]);

  //console.log('aggregationResult ', parameters, aggregationResult, new Date());

  const data = aggregationResult[0].data as Array<
    IPostComment & {totalReplies: number; totalLikes: number; totalDislikes: number; like: State}
  >;

  for (const comment of data) {
    comment.totalReplies = await PostCommentReply.countDocuments({commentId: comment._id});

    const userId = comment.userId.toString();

    if (!uniqueUserIdsMap[userId] && !skipProfileTeaserIdsMap[userId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[userId] = 1;
    }
    // TODO move to utils
    const postCommentStats = await PostCommentStats.find({commentId: comment._id});

    let totalLikes = 0;
    let totalDislikes = 0;
    let tokenData: AccessTokenData;

    if (accessToken) {
      // If user is logged in, fetch his post like stat as well
      const {tokenData: decodedTokenData} = authenticationGuard(accessToken);

      if (decodedTokenData) tokenData = decodedTokenData;
    }

    postCommentStats.forEach((stat) => {
      // Check whether request user has liked post
      if (tokenData && stat.userId.toString() === tokenData.userId) comment.like = stat.like;
      if (stat.like === State.YES) return totalLikes++;
      totalDislikes++; // case: State.NO
    });

    comment.totalLikes = totalLikes;
    comment.totalDislikes = totalDislikes;
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);

  let postCommentsTotal = null;
  let totalCommentsReplies = null;

  if (!parameters.offset) {
    // Calculate only on the first most comment load
    postCommentsTotal = await PostComment.countDocuments({
      postId,
    });

    if (postCommentsTotal) {
      const replyCount = await PostCommentReply.countDocuments({
        postId,
      }).exec();

      totalCommentsReplies = postCommentsTotal + replyCount;
    } else {
      totalCommentsReplies = 0;
    }
  }

  return {
    postComments: {
      data,
      total: postCommentsTotal,
    },
    totalCommentsReplies: totalCommentsReplies,
    userProfileTeasers: userProfileTeasersByUserIds(uniqueUserIds),
  };
};
// TODO extend with commentId ???
const postCommentsByPostId = (
  _: unknown,
  {
    postId,
    skipPostCommentIds,
    skipProfileTeaserIds,
    parameters,
  }: {
    postId: string;
    skipPostCommentIds: Array<string>;
    skipProfileTeaserIds: Array<string>;
    parameters: RequestParameters;
  },
  {accessToken}: {accessToken: string},
): Promise<unknown> | null => {
  const {isInvalidData} = checkDataValidity({
    data: {postId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      postId: RECORD_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isSafeInteger,
      limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_COMMENT_FETCH_LIMIT,
    },
  });

  if (isInvalidData) return null;

  return aggregatePostCommentData(
    postId,
    skipPostCommentIds,
    skipProfileTeaserIds,
    parameters,
    accessToken,
  );
};

export const postCommentQueryResolvers = {
  Query: {
    postCommentsByPostId,
  },
};
