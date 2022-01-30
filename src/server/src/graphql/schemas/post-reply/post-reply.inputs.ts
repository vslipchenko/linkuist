import {gql} from 'apollo-server-express';

export const postReplyInputs = gql`
  input CreatePostReplyMutationInput {
    postId: ID!
    commentId: ID!
    body: String!
  }

  input DeletePostReplyMutationInput {
    _id: String
  }
`;
