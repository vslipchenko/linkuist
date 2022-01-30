import gql from 'graphql-tag';

export const GET_POST_REPLIES_BY_COMMENT_ID = gql`
  query (
    $commentId: String!
    $skipPostReplyIds: [String]!
    $skipProfileTeaserIds: [String]!
    $parameters: RequestParameters!
  ) {
    postRepliesByCommentId(
      commentId: $commentId
      skipPostReplyIds: $skipPostReplyIds
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      postReplies {
        data {
          _id
          userId
          body
          likes
          createdAt
        }
        total
      }
      userProfileTeasers {
        _id
        username
        profile {
          avatarUrl
        }
        isVerified
      }
    }
  }
`;
