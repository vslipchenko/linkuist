import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {getUtcTimestamp} from '../../../utilities/date';
import {Post} from '../../../models/post';
import {PostCommentReply} from '../../../models/post-reply';

// TODO Deletion functionality (should delete both parent comment & related replies)

export const postCommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostComment(input: CreatePostCommentMutationInput): PostComment
    deletePostComment(commentId: ID!): PostCommentDeletedCount
  }
`;

const createPostComment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, 'postId' | 'body'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostComment> | ApolloError | null> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input,
    pattern: {
      postId: RECORD_ID_REGEXP,
      commentId: RECORD_ID_REGEXP,
      body: (value: unknown) => typeof value === 'string' && value.length < 3001,
    },
  });

  console.log(isInvalidData, input);

  if (isInvalidData) return null;

  return PostComment.create({...input, userId: tokenData.userId, createdAt: getUtcTimestamp()});
};

const deletePostComment = async (
  _: unknown,
  {commentId}: {commentId: IPostComment['_id']},
  {accessToken}: {accessToken: string},
): Promise<{commentDeletedCount: number; replyDeletedCount: number} | null | ApolloError> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: commentId,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  const postComment = await PostComment.findOne({_id: commentId}, 'postId').exec();

  if (!postComment) return null;

  const post = await Post.findOne({_id: postComment.postId}, 'userId').exec();

  if (!post) return null;

  const isPostOwner = post.userId.toString() === tokenData.userId;

  const commentFilter = {
    _id: commentId,
  } as {_id: string; userId?: string};

  if (!isPostOwner) commentFilter.userId = tokenData.userId;

  const failedDeletionResult = {
    commentDeletedCount: 0,
    replyDeletedCount: 0,
  };

  try {
    const {deletedCount: commentDeletedCount} = await PostComment.deleteOne(commentFilter);

    const {deletedCount: replyDeletedCount} = await PostCommentReply.deleteMany({
      commentId,
    }); // Delete reply thread

    return {
      commentDeletedCount,
      replyDeletedCount,
    };
  } catch {
    return failedDeletionResult;
  }
};

export const postCommentMutationResolvers = {
  Mutation: {
    createPostComment,
    deletePostComment,
  },
};
