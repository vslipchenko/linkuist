import gql from 'graphql-tag';

export const GET_POSTS_BY_USER_ID = gql`
  query ($userId: String!, $order: SortOrder) {
    postsByUserId(userId: $userId, order: $order) {
      createdAt
      text
      isRepost
    }
  }
`;

export const GET_POSTS_BY_USERNAME = gql`
  query ($username: String!, $order: SortOrder) {
    postsByUsername(username: $username, order: $order) {
      createdAt
      text
      isRepost
    }
  }
`;
