import {gql} from 'apollo-server-express';

export const postCommentQueryTypeDefinitions = gql`
  extend type Query {
    postsCommentByPostId(input: Void): Void
  }
`;

const postsCommentByPostId = () => {};

export const postCommentQueryResolvers = {
  Query: {
    postsCommentByPostId,
  },
};
