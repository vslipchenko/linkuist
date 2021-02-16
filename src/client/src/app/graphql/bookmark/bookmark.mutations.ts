import gql from 'graphql-tag';

export const CREATE_BOOKMARK = gql`
  mutation ($input: CreateBookmarkMutationInput!) {
    createBookmark(input: $input) {
      _id
    }
  }
`;
