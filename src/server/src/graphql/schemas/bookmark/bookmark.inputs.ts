import {gql} from 'apollo-server-express';

export const bookmarkInputs = gql`
  input CreateBookmarkMutationInput {
    id: Float!
    link: String!
    title: String
    image: String
    icon: String
    description: String
    tags: [String!]!
  }
`;
