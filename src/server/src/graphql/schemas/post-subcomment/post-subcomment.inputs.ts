import {gql} from 'apollo-server-express';

export const postSubcommentInputs = gql`
  input CreatePostSubcommentMutationInput {
    postId: ID!
    commentId: ID!
    body: String!
  }

  input DeletePostSubcommentMutationInput {
    _id: String
  }
`;
