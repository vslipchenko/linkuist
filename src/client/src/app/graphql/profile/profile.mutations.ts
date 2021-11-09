import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
  mutation ($input: UpdateProfileMutationInput!) {
    updateProfile(input: $input) {
      profile {
        backgroundUrl
        avatarUrl
        name
        bio
      }
      isVerified
    }
  }
`;
