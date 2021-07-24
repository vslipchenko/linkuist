import {gql} from 'apollo-server-express';

export const linkardTypes = gql`
  type Linkard {
    _id: ID!
    createdAt: Float!
    link: String!
    isPrivate: Boolean!
    isPaid: Boolean!
    note: String
    metadata: LinkardMetadata
    tags: [LinkardTag!]!
  }

  type LinkardTag {
    text: String!
  }

  type LinkardMetadata {
    hostname: String
    sitename: String
    title: String
    description: String
    image: String
    icon: String
  }
`;
