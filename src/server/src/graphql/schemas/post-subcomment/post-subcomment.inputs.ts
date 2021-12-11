import {gql} from 'apollo-server-express';

export const postSubcommentInputs = gql`
  input CreatePostSubcommentMutationInput {
    postId: ID!
    commentId: ID!
    body: String!
  }
`;
