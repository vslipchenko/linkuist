import {gql} from 'apollo-server-express';
import {RequestParameters} from '../../../types/shared/shared.types';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {SortOrder} from '../../../types/shared/shared.enums';
import {POST_COMMENT_FETCH_LIMIT} from '../../../constants/post';
import mongoose from 'mongoose';
import {PostComment} from '../../../models/post-comment';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {userProfileTeasersByUserIds} from '../user/user.queries';
import {postCommentSubcommentTotalCount} from '../post/post.queries';

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
): Promise<unknown> => {
  const uniqueUserIdsMap: {[userId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[userId: string]: number} = {};

  skipProfileTeaserIds.forEach((userId) => (skipProfileTeaserIdsMap[userId] = 1));

  const aggregationResult = await PostComment.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
        commentId: {$exists: false},
        _id: {$nin: skipPostCommentIds.map((id) => new mongoose.Types.ObjectId(id))}, // do not lookup for recently added comments in order to avoid duplicate entry & wrong results
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

  const data = aggregationResult[0].data as Array<IPostComment & {totalSubcomments: number}>;

  for (const comment of data) {
    comment.totalSubcomments = await PostComment.countDocuments({commentId: comment._id});

    const userId = comment.userId.toString();

    if (!uniqueUserIdsMap[userId] && !skipProfileTeaserIdsMap[userId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[userId] = 1;
    }
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);

  return {
    postComments: {
      data,
      total: !parameters.offset
        ? await PostComment.countDocuments({
            postId,
            commentId: {$exists: false}, // do not count subcomments (replies)
          })
        : null,
    },
    totalCommentsSubcomments: !parameters.offset
      ? await postCommentSubcommentTotalCount(postId)
      : null,
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

  return aggregatePostCommentData(postId, skipPostCommentIds, skipProfileTeaserIds, parameters);
};

export const postCommentQueryResolvers = {
  Query: {
    postCommentsByPostId,
  },
};
