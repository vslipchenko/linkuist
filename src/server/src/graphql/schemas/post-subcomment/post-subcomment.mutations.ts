import {ApolloError, gql} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IPostComment} from '../../../types/post-comment/post-comment.interfaces';

export const postSubcommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostSubcomment(input: CreatePostSubcommentMutationInput): PostComment
  }
`;

const createPostSubcomment = async (
  _: unknown,
  {input}: {input: Pick<IPostComment, 'commentId' | 'body'>},
  {accessToken}: {accessToken: string},
): Promise<MongooseDocument<IPostComment> | ApolloError | null> => {
  return null;
};

export const postSubcommentMutationResolvers = {
  Mutation: {
    createPostSubcomment,
  },
};
