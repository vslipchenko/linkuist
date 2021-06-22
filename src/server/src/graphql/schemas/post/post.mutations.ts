import {gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPost} from '../../../types/post/post.interfaces';

const createPost = (_: unknown, input: {input: IPost}): Promise<MongooseDocument<unknown>> => {
  return new Promise(() => {});
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
