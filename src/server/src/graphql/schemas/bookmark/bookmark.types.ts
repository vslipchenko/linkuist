import {gql} from 'apollo-server-express';

export const bookmarkTypes = gql`
  type Bookmark {
    _id: ID!
    id: Float!
    userId: String!
    link: String!
    title: String
    image: String
    icon: String
    description: String
    tags: [String!]!
  }
`;
