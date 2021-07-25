import {gql} from 'apollo-server-express';

export const profileTypes = gql`
  type Profile {
    # _id: ID!
    backgroundUrl: String
    avatarUrl: String
    name: String
    bio: String
  }
`;
