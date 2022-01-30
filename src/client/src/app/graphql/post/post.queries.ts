import gql from 'graphql-tag';

export const GET_POSTS_BY_USER_ID = gql`
  query ($userId: String!, $skipProfileTeaserIds: [String]!, $parameters: RequestParameters!) {
    postsByUserId(
      userId: $userId
      skipProfileTeaserIds: $skipProfileTeaserIds
      parameters: $parameters
    ) {
      posts {
        data {
          _id
          userId
          # date
          createdAt
          text
          totalComments
          totalCommentsReplies
          totalLikes
          totalDislikes
          totalShares
          like
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

// export const GET_POSTS_BY_USERNAME = gql`
//   query ($username: String!, $parameters: RequestParameters!) {
//     postsByUsername(username: $username, parameters: $parameters) {
//       posts {
//         data {
//           _id
//           userId
//           # date
//           createdAt
//           text
//           isRepost
//         }
//         total
//       }
//       userProfileTeasers {
//         _id
//         username
//         _profile {
//           avatarUrl
//         }
//       }
//     }
//   }
// `;
