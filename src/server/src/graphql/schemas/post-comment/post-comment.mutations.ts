import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {getUtcTimestamp} from '../../../utilities/date';

// TODO Deletion functionality (should delete both parent comment & related subcomments)

export const postCommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostComment(input: CreatePostCommentMutationInput): PostComment
    deletePostComment(input: DeletePostCommentMutationInput!): PostCommentDeletedCount
  }
`;

const createPostComment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, 'postId' | 'body' | 'userId'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostComment> | ApolloError | null> => {
  const {tokenData, error} = await authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input,
    pattern: {
      postId: RECORD_ID_REGEXP,
      userId: RECORD_ID_REGEXP,
      commentId: RECORD_ID_REGEXP,
      body: (value: unknown) => typeof value === 'string' && value.length < 3001,
    },
  });

  console.log(isInvalidData, input);

  if (isInvalidData) return null;

  return PostComment.create({...input, authorId: tokenData.userId, createdAt: getUtcTimestamp()});
};

const deletePostComment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, '_id'>},
  {accessToken}: {accessToken: string},
): Promise<
  {commentDeletedCount: number; subcommentDeletedCount: number} | null | undefined | ApolloError
> => {
  const {tokenData, error} = await authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input._id,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  try {
    const {deletedCount: commentDeletedCount} = await PostComment.deleteOne({
      _id: input._id,
      userId: tokenData.userId, // check TODO 28.9.27
    });

    const {deletedCount: subcommentDeletedCount} = await PostComment.deleteMany({
      commentId: input._id,
      userId: tokenData.userId, // check TODO 28.9.27
    });

    return {
      commentDeletedCount,
      subcommentDeletedCount,
    };
  } catch {
    return {
      commentDeletedCount: 0,
      subcommentDeletedCount: 0,
    };
  }
};

export const postCommentMutationResolvers = {
  Mutation: {
    createPostComment,
    deletePostComment,
  },
};
