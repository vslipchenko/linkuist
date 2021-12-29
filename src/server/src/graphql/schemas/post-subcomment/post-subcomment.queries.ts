import {gql} from 'apollo-server-express';
import {RequestParameters} from '../../../types/shared/shared.types';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {SortOrder} from '../../../types/shared/shared.enums';
import {POST_SUBCOMMENT_FETCH_LIMIT} from '../../../constants/post';
import {PostComment} from '../../../models/post-comment';
import mongoose from 'mongoose';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {userProfileTeasersByUserIds} from '../user/user.queries';

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
  const uniqueUserIdsMap: {[authorId: string]: number} = {};
  const skipProfileTeaserIdsMap: {[authorId: string]: number} = {};

  skipProfileTeaserIds.forEach((authorId) => (skipProfileTeaserIdsMap[authorId] = 1));

  const aggregationResult = await PostComment.aggregate([
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

  const data = aggregationResult[0].data as Array<IPostComment>;

  for (const comment of data) {
    // console.log(comment);
    const authorId = comment.authorId.toString();

    if (!uniqueUserIdsMap[authorId] && !skipProfileTeaserIdsMap[authorId]) {
      // console.log('unique ', post.userId.toString(), uniqueUserIdsMap, skipProfileTeaserIds);
      uniqueUserIdsMap[authorId] = 1;
    }
  }

  const uniqueUserIds = Object.keys(uniqueUserIdsMap);

  return {
    postSubcomments: {
      data,
      // total: aggregationResult[0].total.length ? aggregationResult[0].total[0].total : 0,
      total: await PostComment.countDocuments({
        commentId: commentId,
      }),
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
