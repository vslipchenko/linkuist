import {gql} from 'apollo-server-express';

export const linkardInputs = gql`
  input CreateLinkardMutationInput {
    id: Float!
    link: String!
    isPrivate: Boolean!
    isPaid: Boolean!
    note: String
    tags: [String!]!
  }
`;
