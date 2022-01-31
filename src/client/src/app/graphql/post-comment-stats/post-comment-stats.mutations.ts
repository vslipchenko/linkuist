import gql from 'graphql-tag';

export const LIKE_POST_COMMENT = gql`
  mutation ($input: LikePostCommentMutationInput!) {
    likePostComment(input: $input) {
      like
      deletedCount
    }
  }
`;
