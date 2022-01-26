import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {Post} from '../../../models/post';
import {getUtcTimestamp} from '../../../utilities/date';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {PostStats} from '../../../models/post-stats';

export const postMutationTypeDefinitions = gql`
  extend type Mutation {
    createPost(input: CreatePostMutationInput!): Post
    deletePost(input: DeletePostMutationInput!): PostDeletedCount
  }
`;

const createPost = async (
  _: unknown,
  {input}: {input: Omit<IPost, 'createdAt' | '_id'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPost> | ApolloError> => {
  const {tokenData, error} = authenticationGuard(accessToken);
  // console.warn(accessToken, error);
  if (error) return error;

  return Post.create({...input, userId: tokenData.userId, createdAt: getUtcTimestamp()});
};

const deletePost = async (
  _: unknown,
  {input}: {input: Pick<IPost, '_id'>},
  {accessToken}: {accessToken: string},
): Promise<{postDeletedCount: number; commentDeletedCount: number} | null | ApolloError> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input._id,
    pattern: RECORD_ID_REGEXP,
  });
  // console.log(isValidData, input);
  if (isInvalidData) return null;
  // console.warn(accessToken, error);

  // return Post.deleteOne(input);
  const failedDeletionResult = {
    postDeletedCount: 0,
    commentDeletedCount: 0,
  };

  try {
    const {deletedCount: postDeletedCount} = await Post.deleteOne({
      _id: input._id,
      userId: tokenData.userId, // userId condition is used in order to prevent deletion by third-parties
    });

    // Assume user is a true post owner & it was deleted successfully
    const {deletedCount: commentDeletedCount} = await PostComment.deleteMany({
      postId: input._id,
    });
    // Clear post stats
    await PostStats.deleteMany({
      postId: input._id,
    });
    // TODO: Clear comment stats

    return {
      postDeletedCount,
      commentDeletedCount, // Includes subcomments as well
    };
  } catch {
    return failedDeletionResult;
  }
};

export const postMutationResolvers = {
  Mutation: {
    createPost,
    deletePost,
  },
};
