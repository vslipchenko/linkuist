import {gql} from 'apollo-server-express';

export const postCommentStatsInputs = gql`
  input LikePostCommentMutationInput {
    commentId: ID!
    like: Int!
  }
`;
