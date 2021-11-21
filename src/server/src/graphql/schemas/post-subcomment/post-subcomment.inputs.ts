import {gql} from 'apollo-server-express';

export const postSubcommentInputs = gql`
  input CreatePostSubcommentMutationInput {
    commentId: ID!
    body: String!
  }
`;
