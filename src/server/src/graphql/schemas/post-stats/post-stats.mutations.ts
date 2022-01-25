import {ApolloError, gql} from 'apollo-server-express';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {State} from '../../../types/shared/shared.enums';
import {PostStats} from '../../../models/post-stats';
import {IPostStats} from '../../../types/post-stats/post-stats.interface';
import {Post} from '../../../models/post';

export const postStatsMutationTypeDefinitions = gql`
  extend type Mutation {
    likePost(input: LikePostMutationInput!): LikePostResult
    sharePost(postId: ID!): LikePostResult!
  }
`;

const likePost = async (
  _: unknown,
  {input}: {input: {postId: IPostComment['postId']; like: State}},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostStats> | {deletedCount: number} | ApolloError | null> => {
  // TODO CHECK TOKEN DATA INTEGRITY ISSUE, STAT ABUSE
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input.postId,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  const postExists = await Post.exists({_id: input.postId});

  if (!postExists) return null;

  const filter = {
    postId: input.postId,
    userId: tokenData.userId,
  };

  if (input.like === State.NONE) {
    try {
      const {deletedCount} = await PostStats.deleteOne(filter);

      return {deletedCount};
    } catch {
      return {deletedCount: 0};
    }
  }

  return PostStats.findOneAndUpdate(filter, {like: input.like}, {upsert: true, new: true});
};

const sharePost = async (
  _: unknown,
  {postId}: {postId: Pick<IPostComment, 'postId'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostComment> | ApolloError | null> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: postId,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  return null;
};

export const postStatsMutationResolvers = {
  Mutation: {
    likePost,
    sharePost,
  },
};
