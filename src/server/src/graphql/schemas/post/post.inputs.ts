import {gql} from 'apollo-server-express';

export const postInputs = gql`
  input CreatePostMutationInput {
    id: Float!
    text: String
    postObjectId: String
    isRepost: Boolean!
  }
`;
