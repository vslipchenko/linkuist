import gql from 'graphql-tag';

export const GET_POST_COMMENTS_BY_POST_ID = gql`
  query ($postId: String!, $skipProfileTeaserIds: [String]!, $parameters: RequestParameters!) {
    postCommentsByPostId(
      postId: $postId
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      postComments {
        data {
          _id
          userId
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
      }
    }
  }
`;
