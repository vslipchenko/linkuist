import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';
import {authenticationGuard} from '../../../utilities/guards';
import {Post} from '../../../models/post';
import {getUtcMillisecondTimestamp} from '../../../utilities/date';

const createPost = async (
  _: unknown,
  {input}: {input: Omit<IPost, 'createdAt'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPost> | ApolloError> => {
  const {tokenData, error} = await authenticationGuard(accessToken);
  // console.warn(accessToken, error);
  if (error) return error;

  return Post.create({...input, userId: tokenData.userId, createdAt: getUtcMillisecondTimestamp()});
};

export const postMutationTypeDefinitions = gql`
  extend type Mutation {
    createPost(input: CreatePostMutationInput!): Post
  }
`;

export const postMutationResolvers = {
  Mutation: {
    createPost,
  },
};
