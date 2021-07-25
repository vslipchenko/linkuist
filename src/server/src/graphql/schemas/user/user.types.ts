import {gql} from 'apollo-server-express';

export const userTypes = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
  }

  type UserProfile {
    backgroundUrl: String
    avatarUrl: String
    name: String
    bio: String
  }

  type UserProfileTeaser {
    avatarUrl: String
    username: String
  }
`;
