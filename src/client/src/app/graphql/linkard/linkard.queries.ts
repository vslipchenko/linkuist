import gql from 'graphql-tag';

export const GET_LINKARDS_BY_USERNAME = gql`
  query($username: String!) {
    linkardsByUsername(username: $username) {
      _id
    }
  }
`;
