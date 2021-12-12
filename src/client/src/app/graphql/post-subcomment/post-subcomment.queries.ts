import gql from 'graphql-tag';

export const GET_POST_SUBCOMMENTS_BY_COMMENT_ID = gql`
  query (
    $commentId: String!
    $skipPostSubcommentIds: [String]!
    $skipProfileTeaserIds: [String]!
    $parameters: RequestParameters!
  ) {
    postSubcommentsByCommentId(
      commentId: $commentId
      skipPostSubcommentIds: $skipPostSubcommentIds
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      postSubcomments {
        data {
          _id
          userId
          commentId
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
