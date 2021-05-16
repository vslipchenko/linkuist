import gql from 'graphql-tag';

export const GET_LINKARDS_BY_USER_ID = gql`
  query($userId: String!) {
    linkardsByUserId(userId: $userId) {
      id
      metadata
    }
  }
`;

export const GET_LINKARDS_BY_USERNAME = gql`
  query($username: String!) {
    linkardsByUsername(username: $username) {
      id
      metadata
    }
  }
`;
