import {gql} from 'apollo-server-express';

export const profileInputs = gql`
  input UpdateProfileMutationInput {
    backgroundUrl: String
    avatarUrl: String
    name: String
    bio: String
  }
`;
