import gql from 'graphql-tag';

export const LIKE_POST_REPLY = gql`
  mutation ($input: LikePostReplyMutationInput!) {
    likePostReply(input: $input) {
      like
      deletedCount
    }
  }
`;
