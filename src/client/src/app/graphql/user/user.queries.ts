import gql from 'graphql-tag';

export const USER_EMAIL_BY_EMAIL = gql`
  query ($email: String!) {
    userEmailByEmail(email: $email) {
      email
    }
  }
`;

export const USER_ID_BY_USERNAME = gql`
  query ($username: String!) {
    userIdByUsername(username: $username) {
      _id
    }
  }
`;

export const GET_PROFILE_BY_USER_ID = gql`
  query ($userId: String!) {
    profileByUserId(userId: $userId) {
      profile {
        backgroundUrl
        avatarUrl
        name
        bio
      }
    }
  }
`;

export const GET_PROFILE_BY_USERNAME = gql`
  query ($username: String!) {
    profileByUsername(username: $username) {
      profile {
        backgroundUrl
        avatarUrl
        name
        bio
      }
    }
  }
`;

export const GET_PROFILE_TEASER_BY_USER_ID = gql`
  query ($userId: String!) {
    profileTeaserByUserId(userId: $userId) {
      avatarUrl
      username
    }
  }
`;

export const GET_PROFILE_TEASER_BY_USERNAME = gql`
  query ($username: String!) {
    profileTeaserByUsername(username: $username) {
      avatarUrl
      username
    }
  }
`;
