import gql from 'graphql-tag';

export const CREATE_POST_REPLY = gql`
  mutation ($input: CreatePostReplyMutationInput!) {
    createPostReply(input: $input) {
      _id
      commentId
      userId
      body
      likes
      createdAt
    }
  }
`;

export const DELETE_POST_REPLY = gql`
  mutation ($replyId: ID!) {
    deletePostReply(replyId: $replyId)
  }
`;
