import {State} from '../../../types/shared/shared.enums';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {ApolloError, gql} from 'apollo-server-express';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {IPostCommentReply} from '../../../types/post-reply/post-reply.interfaces';
import {PostCommentReply} from '../../../models/post-reply';
import {PostReplyStats} from '../../../models/post-reply-stats';
import {IPostReplyStats} from '../../../types/post-reply-stats/post-reply-stats.interfaces';

export const postReplyStatsMutationTypeDefinitions = gql`
  extend type Mutation {
    likePostReply(input: LikePostReplyMutationInput!): LikePostCommentResult
  }
`;

const likePostReply = async (
  _: unknown,
  {input}: {input: {replyId: IPostCommentReply['_id']; like: State}},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostReplyStats> | {deletedCount: number} | ApolloError | null> => {
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

  const postReplyExists = await PostCommentReply.exists({_id: input.replyId});

  if (!postReplyExists) return null;

  const filter = {
    replyId: input.replyId,
    userId: tokenData.userId,
  };

  if (input.like === State.NONE) {
    try {
      const {deletedCount} = await PostReplyStats.deleteOne(filter);

      return {deletedCount};
    } catch {
      return {deletedCount: 0};
    }
  }

  return PostReplyStats.findOneAndUpdate(filter, {like: input.like}, {upsert: true, new: true});
};

export const postReplyStatsMutationResolvers = {
  Mutation: {
    likePostReply,
  },
};
