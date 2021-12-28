import {gql} from 'apollo-server-express';

export const postCommentInputs = gql`
  input CreatePostCommentMutationInput {
    postId: ID!
    body: String!
  }

  input DeletePostCommentMutationInput {
    _id: String
  }
`;
