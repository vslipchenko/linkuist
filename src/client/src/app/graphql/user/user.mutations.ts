import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
  mutation ($input: CreateUserMutationInput!) {
    createUser(input: $input) {
      _id
    }
  }
`;
