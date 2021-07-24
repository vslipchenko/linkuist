import {gql} from 'apollo-server-express';

export const linkardInputs = gql`
  input CreateLinkardMutationInput {
    link: String!
    isPrivate: Boolean!
    isPaid: Boolean!
    note: String
    tags: [CreateLinkardTagInput!]!
  }

  input CreateLinkardTagInput {
    text: String!
  }
`;
