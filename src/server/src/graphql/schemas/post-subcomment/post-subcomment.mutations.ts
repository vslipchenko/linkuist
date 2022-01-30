import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {getUtcTimestamp} from '../../../utilities/date';
import {Post} from '../../../models/post';
import {IPostCommentReply} from '../../../types/post-reply/post-reply.interface';
import {PostCommentReply} from '../../../models/post-reply';

export const postSubcommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostSubcomment(input: CreatePostSubcommentMutationInput): PostSubcomment
    deletePostSubcomment(subcommentId: ID!): Int!
  }
`;

const createPostSubcomment = async (
  _: unknown,
  {input}: {input: Pick<IPostCommentReply, 'postId' | 'commentId' | 'body'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostCommentReply> | ApolloError | null> => {
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

  return PostCommentReply.create({
    ...input,
    userId: tokenData.userId,
    createdAt: getUtcTimestamp(),
  });
};

const deletePostSubcomment = async (
  _: unknown,
  {subcommentId}: {subcommentId: IPostComment['_id']},
  {accessToken}: {accessToken: string},
): Promise<number | null | ApolloError> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: subcommentId,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  const postComment = await PostComment.findOne({_id: subcommentId}, 'postId').exec();

  if (!postComment) return null;

  const post = await Post.findOne({_id: postComment.postId}, 'userId').exec();

  if (!post) return null;

  const isPostOwner = post.userId.toString() === tokenData.userId;

  const subcommentFilter = {
    _id: subcommentId,
  } as {_id: string; userId?: string};

  if (!isPostOwner) subcommentFilter.userId = tokenData.userId;

  try {
    const {deletedCount: subcommentDeletedCount} = await PostComment.deleteOne(subcommentFilter);

    return subcommentDeletedCount;
  } catch {
    return 0;
  }
};

export const postSubcommentMutationResolvers = {
  Mutation: {
    createPostSubcomment,
    deletePostSubcomment,
  },
};
