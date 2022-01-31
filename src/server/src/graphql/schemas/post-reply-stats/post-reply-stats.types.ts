import {gql} from 'apollo-server-express';

export const postReplyStatsTypes = gql`
  type LikePostReplyResult {
    deletedCount: Int
    like: Int
  }
`;
