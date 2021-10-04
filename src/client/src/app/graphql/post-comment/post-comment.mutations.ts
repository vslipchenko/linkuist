import gql from 'graphql-tag';

export const CREATE_POST_COMMENT = gql`
  mutation ($input: CreatePostCommentMutationInput!) {
    createPostComment(input: $input) {
      _id
    }
  }
`;
