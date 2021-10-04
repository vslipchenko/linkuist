import {gql} from 'apollo-server-express';

export const postCommentInputs = gql`
  input CreatePostCommentMutationInput {
    postId: ID!
    commentId: ID
    body: String!
  }
`;
