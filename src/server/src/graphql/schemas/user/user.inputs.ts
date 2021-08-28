import {gql} from 'apollo-server-express';

export const userInputs = gql`
  input CreateUserMutationInput {
    email: String!
    username: String!
    password: String!
    repeatPassword: String!
  }

  input UpdateProfileMutationInput {
    backgroundUrl: String
    avatarUrl: String
    name: String
    bio: String
  }
`;
