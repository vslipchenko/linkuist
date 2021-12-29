import gql from 'graphql-tag';

export const CREATE_POST_SUBCOMMENT = gql`
  mutation ($input: CreatePostSubcommentMutationInput!) {
    createPostSubcomment(input: $input) {
      _id
      commentId
      userId
      body
      likes
      createdAt
    }
  }
`;
