import {gql} from 'apollo-server-express';

export const postReplyStatsInputs = gql`
  input LikePostReplyMutationInput {
    replyId: ID!
    like: Int!
  }
`;
