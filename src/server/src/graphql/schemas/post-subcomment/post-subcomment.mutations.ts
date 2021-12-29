import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {PostComment} from '../../../models/post-comment';
import {getUtcTimestamp} from '../../../utilities/date';

export const postSubcommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostSubcomment(input: CreatePostSubcommentMutationInput): PostSubcomment
    deletePostSubcomment(input: DeletePostSubcommentMutationInput!): Int!
  }
`;

const createPostSubcomment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, 'postId' | 'commentId' | 'body' | 'userId'>},
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

const deletePostSubcomment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, '_id'>},
  {accessToken}: {accessToken: string},
): Promise<number | null | undefined | ApolloError> => {
  const {tokenData, error} = await authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input._id,
    pattern: RECORD_ID_REGEXP,
  });

  if (isInvalidData) return null;

  try {
    const {deletedCount: subcommentDeletedCount} = await PostComment.deleteOne({
      _id: input._id,
      userId: tokenData.userId, // check TODO 28.9.27
    });

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
