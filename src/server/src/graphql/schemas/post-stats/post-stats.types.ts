import {gql} from 'apollo-server-express';

export const postStatsTypes = gql`
  type LikePostResult {
    deletedCount: Int
    like: Int
  }
`;
