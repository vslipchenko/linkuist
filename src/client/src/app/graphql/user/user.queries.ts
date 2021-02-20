import gql from 'graphql-tag';

export const USER_ID_BY_EMAIL = gql`
  query($email: String!) {
    userByEmail(email: $email) {
      _id
    }
  }
`;

export const USER_ID_BY_USERNAME = gql`
  query($username: String!) {
    userByUsername(username: $username) {
      _id
    }
  }
`;
