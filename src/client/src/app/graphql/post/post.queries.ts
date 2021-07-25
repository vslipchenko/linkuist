import gql from 'graphql-tag';

export const GET_POSTS_BY_USER_ID = gql`
  query ($userId: String!, $parameters: RequestParameters!) {
    postsByUserId(userId: $userId, parameters: $parameters) {
      data {
        createdAt
        text
        isRepost
      }
      total
    }
  }
`;

export const GET_POSTS_BY_USERNAME = gql`
  query ($username: String!, $parameters: RequestParameters!) {
    postsByUsername(username: $username, parameters: $parameters) {
      data {
        createdAt
        text
        isRepost
      }
      total
    }
  }
`;
