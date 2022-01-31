import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {getUtcTimestamp} from '../../../utilities/date';
import {Post} from '../../../models/post';
import {IPostCommentReply} from '../../../types/post-reply/post-reply.interfaces';
import {PostCommentReply} from '../../../models/post-reply';

export const postReplyMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostReply(input: CreatePostReplyMutationInput): PostReply
    deletePostReply(replyId: ID!): Int!
  }
`;

const createPostReply = async (
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

const deletePostReply = async (
  _: unknown,
  {replyId}: {replyId: IPostCommentReply['_id']},
  {accessToken}: {accessToken: string},
): Promise<number | null | ApolloError> => {
  const {tokenData, error} = authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: replyId,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  const postCommentReply = await PostCommentReply.findOne({_id: replyId}, 'postId').exec();

  if (!postCommentReply) return null;

  const post = await Post.findOne({_id: postCommentReply.postId}, 'userId').exec();

  if (!post) return null;

  const isPostOwner = post.userId.toString() === tokenData.userId;

  const replyFilter = {
    _id: replyId,
  } as {_id: string; userId?: string};

  if (!isPostOwner) replyFilter.userId = tokenData.userId;

  try {
    const {deletedCount: replyDeletedCount} = await PostCommentReply.deleteOne(replyFilter);

    return replyDeletedCount;
  } catch {
    return 0;
  }
};

export const postReplyMutationResolvers = {
  Mutation: {
    createPostReply,
    deletePostReply,
  },
};
