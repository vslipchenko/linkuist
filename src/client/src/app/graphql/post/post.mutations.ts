import gql from 'graphql-tag';

export const CREATE_POST = gql`
  mutation ($input: CreatePostMutationInput!) {
    createPost(input: $input) {
      _id
      userId
      createdAt
      text
      isRepost
    }
    # createRepost ...
  }
`;

export const DELETE_POST = gql`
  mutation ($input: DeletePostMutationInput!) {
    deletePost(input: $input) {
      postDeletedCount
      commentDeletedCount
    }
  }
`;
