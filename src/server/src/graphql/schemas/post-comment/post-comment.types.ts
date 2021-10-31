import {gql} from 'apollo-server-express';

export const postCommentTypes = gql`
  # Extended
  type PostComment {
    _id: ID!
    postId: ID!
    userId: ID!
    body: String!
    createdAt: Float!
    likes: Int!
    totalSubcomments: Int!
  }

  type PostComments {
    data: [PostComment]!
    total: Float!
  }

  type UserPostComments {
    postComments: PostComments!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
