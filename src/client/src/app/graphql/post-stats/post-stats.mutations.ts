import gql from 'graphql-tag';

export const LIKE_POST = gql`
  mutation ($input: LikePostMutationInput!) {
    likePost(input: $input) {
      like
      deletedCount
    }
  }
`;
