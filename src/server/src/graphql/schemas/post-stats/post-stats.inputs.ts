import {gql} from 'apollo-server-express';

export const postStatsInputs = gql`
  input LikePostMutationInput {
    postId: ID!
    like: Int!
  }
`;
