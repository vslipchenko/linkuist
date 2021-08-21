import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {Post} from '../../../models/post';
import {getUtcTimestamp} from '../../../utilities/date';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';

export const postMutationTypeDefinitions = gql`
  extend type Mutation {
    createPost(input: CreatePostMutationInput!): Post
    deletePost(input: DeletePostMutationInput!): Int
  }
`;

const createPost = async (
  _: unknown,
  {input}: {input: Omit<IPost, 'createdAt' | '_id'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPost> | ApolloError> => {
  const {tokenData, error} = await authenticationGuard(accessToken);
  // console.warn(accessToken, error);
  if (error) return error;

  return Post.create({...input, userId: tokenData.userId, createdAt: getUtcTimestamp()});
};

const deletePost = async (
  _: unknown,
  {input}: {input: Pick<IPost, '_id'>},
  {accessToken}: {accessToken: string},
): Promise<number | null | undefined | ApolloError> => {
  const {tokenData, error} = await authenticationGuard(accessToken);

  if (error) return error;

  const {isInvalidData} = checkDataValidity({
    data: input._id,
    pattern: RECORD_ID_REGEXP,
  });
  // console.log(isValidData, input);
  if (isInvalidData) return null;
  // console.warn(accessToken, error);

  // return Post.deleteOne(input);

  try {
    const {deletedCount} = await Post.deleteOne({_id: input._id, userId: tokenData.userId});
    return deletedCount;
  } catch {
    return 0;
  }
};

export const postMutationResolvers = {
  Mutation: {
    createPost,
    deletePost,
  },
};
