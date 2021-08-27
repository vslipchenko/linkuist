import {gql} from 'apollo-server-express';

export const postCommentMutationTypeDefinitions = gql`
  extend type Mutation {
    createPostComment(input: Void): Void
  }
`;

const createPostComment = (): void => {};

export const postCommentMutationResolvers = {
  Mutation: {
    createPostComment,
  },
};
