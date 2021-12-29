import gql from 'graphql-tag';

export const GET_POST_COMMENTS_BY_POST_ID = gql`
  query (
    $postId: String!
    $skipPostCommentIds: [String]!
    $skipProfileTeaserIds: [String]!
    $parameters: RequestParameters!
  ) {
    postCommentsByPostId(
      postId: $postId
      skipPostCommentIds: $skipPostCommentIds
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      postComments {
        data {
          _id
          authorId
          postId
          totalSubcomments
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
