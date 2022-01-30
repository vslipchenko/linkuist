import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {State} from '../../../types/shared/shared.enums';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {ApolloError, gql} from 'apollo-server-express';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {PostCommentStats} from '../../../models/post-comment-stats';
import {IPostCommentStats} from '../../../types/post-comment-stats/post-comment-stats.interface';

export const postCommentStatsMutationTypeDefinitions = gql`
  extend type Mutation {
    likePostComment(input: LikePostCommentMutationInput!): LikePostCommentResult
  }
`;

const likePostComment = async (
  _: unknown,
  {input}: {input: {commentId: IPostComment['_id']; like: State}},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostCommentStats> | {deletedCount: number} | ApolloError | null> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input,
    pattern: {
      commentId: RECORD_ID_REGEXP,
      // Make enum condition a part of util method
      like: (value) => value === State.NONE || value === State.YES || value === State.NO,
    },
  });

  if (isInvalidData) return null;

  const postCommentExists = await PostComment.exists({_id: input.commentId});

  if (!postCommentExists) return null;

  const filter = {
    commentId: input.commentId,
    userId: tokenData.userId,
  };

  if (input.like === State.NONE) {
    try {
      const {deletedCount} = await PostCommentStats.deleteOne(filter);

      return {deletedCount};
    } catch {
      return {deletedCount: 0};
    }
  }

  return PostCommentStats.findOneAndUpdate(filter, {like: input.like}, {upsert: true, new: true});
};

export const postCommentStatsMutationResolvers = {
  Mutation: {
    likePostComment,
  },
};
