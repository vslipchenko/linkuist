import {gql} from 'apollo-server-express';

export const postCommentStatsTypes = gql`
  type LikePostCommentResult {
    deletedCount: Int
    like: Int
  }
`;
