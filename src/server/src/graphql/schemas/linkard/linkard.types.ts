import {gql} from 'apollo-server-express';

export const linkardTypes = gql`
  type Linkard {
    _id: ID!
    id: Float!
    userId: String!
    link: String!
    isPrivate: Boolean!
    isPaid: Boolean!
    note: String
    tags: [String!]!
  }
`;
