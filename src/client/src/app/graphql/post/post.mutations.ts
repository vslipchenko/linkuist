import gql from 'graphql-tag';

export const CREATE_POST = gql`
  mutation ($input: CreatePostMutationInput!) {
    createPost(input: $input) {
      _id
    }
  }
`;
