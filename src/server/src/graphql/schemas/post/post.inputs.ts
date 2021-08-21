import {gql} from 'apollo-server-express';

export const postInputs = gql`
  input CreatePostMutationInput {
    text: String
    postId: String
    isRepost: Boolean!
  }

  input DeletePostMutationInput {
    _id: String
  }
`;
