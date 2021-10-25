import gql from 'graphql-tag';

export const GET_POST_COMMENTS_BY_POST_ID = gql`
  query ($postId: String!, $skipProfileTeaserIds: [String]!, $parameters: RequestParameters!) {
    postCommentsByPostId(
      postId: $postId
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      postComments {
        _id
        userId
        subcommentCount
        body
        likes
        createdAt
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
