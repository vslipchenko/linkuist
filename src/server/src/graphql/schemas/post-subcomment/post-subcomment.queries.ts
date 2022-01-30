import {gql} from 'apollo-server-express';
import {RequestParameters} from '../../../types/shared/shared.types';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {SortOrder} from '../../../types/shared/shared.enums';
import {POST_SUBCOMMENT_FETCH_LIMIT} from '../../../constants/post';
import mongoose from 'mongoose';
import {userProfileTeasersByUserIds} from '../user/user.queries';
import {PostCommentReply} from '../../../models/post-reply';
import {IPostCommentReply} from '../../../types/post-reply/post-reply.interface';

export const postSubcommentQueryTypeDefinitions = gql`
  extend type Query {
    postSubcommentsByCommentId(
      commentId: String!
      skipPostSubcommentIds: [String]!
      skipProfileTeaserIds: [String]!
      parameters: RequestParameters!
    ): UserPostSubcomments!
  }
`;

const aggregatePostSubcommentData = async (
  commentId: string,
  skipPostSubcommentIds: Array<string>,
  skipProfileTeaserIds: Array<string>,
  parameters: RequestParameters,
): Promise<unknown> => {
  const uniqueUserIdsMap: {[userId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[userId: string]: number} = {};

  skipProfileTeaserIds.forEach((userId) => (skipProfileTeaserIdsMap[userId] = 1));

  const aggregationResult = await PostCommentReply.aggregate([
    {
      $match: {
        _id: {$nin: skipPostSubcommentIds.map((id) => new mongoose.Types.ObjectId(id))},
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

  const data = aggregationResult[0].data as Array<IPostCommentReply>;

  for (const comment of data) {
    // console.log(comment);
    const userId = comment.userId.toString();

    if (!uniqueUserIdsMap[userId] && !skipProfileTeaserIdsMap[userId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[userId] = 1;
    }
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);

  return {
    postSubcomments: {
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
const postSubcommentsByCommentId = (
  _: unknown,
  {
    commentId,
    skipPostSubcommentIds,
    skipProfileTeaserIds,
    parameters,
  }: {
    commentId: string;
    skipPostSubcommentIds: Array<string>;
    skipProfileTeaserIds: Array<string>;
    parameters: RequestParameters;
  },
): Promise<unknown> | null => {
  const {isInvalidData} = checkDataValidity({
    data: {commentId, order: parameters.order, offset: parameters.offset, limit: parameters.limit},
    ignoreUndefinedValuePaths: ['order', 'offset'],
    pattern: {
      commentId: RECORD_ID_REGEXP,
      order: (value) => value === SortOrder.ASCENDING || value === SortOrder.DESCENDING,
      offset: Number.isSafeInteger,
      limit: (value) =>
        Number.isInteger(value) && value > 0 && value <= POST_SUBCOMMENT_FETCH_LIMIT,
    },
  });

  if (isInvalidData) return null;

  return aggregatePostSubcommentData(
    commentId,
    skipPostSubcommentIds,
    skipProfileTeaserIds,
    parameters,
  );
};

export const postSubcommentQueryResolvers = {
  Query: {
    postSubcommentsByCommentId,
  },
};
