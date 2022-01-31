import {gql} from 'apollo-server-express';
import {RequestParameters} from '../../../types/shared/shared.types';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {SortOrder, State} from '../../../types/shared/shared.enums';
import {POST_REPLY_FETCH_LIMIT} from '../../../constants/post';
import mongoose from 'mongoose';
import {userProfileTeasersByUserIds} from '../user/user.queries';
import {PostCommentReply} from '../../../models/post-reply';
import {IPostCommentReply} from '../../../types/post-reply/post-reply.interfaces';
import {AccessTokenData} from '../../../types/jwt/jwt.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {PostReplyStats} from '../../../models/post-reply-stats';

export const postReplyQueryTypeDefinitions = gql`
  extend type Query {
    postRepliesByCommentId(
      commentId: String!
      skipPostReplyIds: [String]!
      skipProfileTeaserIds: [String]!
      parameters: RequestParameters!
    ): UserPostReplies!
  }
`;

const aggregatePostReplyData = async (
  commentId: string,
  skipPostReplyIds: Array<string>,
  skipProfileTeaserIds: Array<string>,
  parameters: RequestParameters,
  accessToken: string,
): Promise<unknown> => {
  const uniqueUserIdsMap: {[userId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[userId: string]: number} = {};

  skipProfileTeaserIds.forEach((userId) => (skipProfileTeaserIdsMap[userId] = 1));

  const aggregationResult = await PostCommentReply.aggregate([
    {
      $match: {
        _id: {$nin: skipPostReplyIds.map((id) => new mongoose.Types.ObjectId(id))},
        commentId: new mongoose.Types.ObjectId(commentId),
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
      },
    },
  ]);

  //console.log('aggregationResult ', parameters, aggregationResult, new Date());

  const data = aggregationResult[0].data as Array<
    IPostCommentReply & {totalLikes: number; totalDislikes: number; like: State}
  >;

  for (const reply of data) {
    // console.log(comment);
    const userId = reply.userId.toString();

    if (!uniqueUserIdsMap[userId] && !skipProfileTeaserIdsMap[userId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[userId] = 1;
    }

    // TODO move to utils
    const postReplyStats = await PostReplyStats.find({replyId: reply._id});

    let totalLikes = 0;
    let totalDislikes = 0;
    let tokenData: AccessTokenData;

    if (accessToken) {
      // If user is logged in, fetch his post like stat as well
      const {tokenData: decodedTokenData} = authenticationGuard(accessToken);

      if (decodedTokenData) tokenData = decodedTokenData;
    }

    postReplyStats.forEach((stat) => {
      // Check whether request user has liked post
      if (tokenData && stat.userId.toString() === tokenData.userId) reply.like = stat.like;
      if (stat.like === State.YES) return totalLikes++;
      totalDislikes++; // case: State.NO
    });

    reply.totalLikes = totalLikes;
    reply.totalDislikes = totalDislikes;
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);

  return {
    postReplies: {
      data,
      total: !parameters.offset
        ? await PostCommentReply.countDocuments({
            commentId: commentId,
          })
        : null,
    },
    userProfileTeasers: userProfileTeasersByUserIds(uniqueUserIds),
  };
};

// TODO extend with commentId ???
const postRepliesByCommentId = (
  _: unknown,
  {
    commentId,
    skipPostReplyIds,
    skipProfileTeaserIds,
    parameters,
  }: {
    commentId: string;
    skipPostReplyIds: Array<string>;
    skipProfileTeaserIds: Array<string>;
    parameters: RequestParameters;
  },
  {accessToken}: {accessToken: string},
): Promise<unknown> | null => {
  const {isInvalidData} = checkDataValidity({
    data: {commentId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      commentId: RECORD_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isSafeInteger,
      limit: (value) => Number.isInteger(value) && value > 0 && value <= POST_REPLY_FETCH_LIMIT,
    },
  });

  if (isInvalidData) return null;

  return aggregatePostReplyData(
    commentId,
    skipPostReplyIds,
    skipProfileTeaserIds,
    parameters,
    accessToken,
  );
};

export const postReplyQueryResolvers = {
  Query: {
    postRepliesByCommentId,
  },
};
