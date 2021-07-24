import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
  mutation ($input: UpdateProfileMutationInput!) {
    updateProfile(input: $input) {
      backgroundUrl
      avatarUrl
      name
      bio
    }
  }
`;
