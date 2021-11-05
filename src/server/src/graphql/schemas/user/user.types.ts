import {gql} from 'apollo-server-express';

export const userTypes = gql`
  type CreatedUser {
    _id: ID!
    email: String!
    username: String!
  }

  type UserEmail {
    email: String!
  }

  type Profile {
    backgroundUrl: String
    avatarUrl: String
    name: String
    bio: String
  }

  type UserProfile {
    profile: Profile
  }

  type UserProfileTeaser {
    _id: ID! # user id
    profile: Profile
    username: String
    isVerified: Boolean
  }
`;
