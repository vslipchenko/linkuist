import {gql} from 'apollo-server-express';

export const postCommentTypes = gql`
  # Extended
  type PostComment {
    _id: ID!
    postId: ID!
    userId: ID!
    body: String!
    createdAt: Float!
    likes: Int # Null for created comment
    totalReplies: Int!
    totalLikes: Float! # DOES NOT EXIST FOR COMMENT CREATE; FOR UI NEEDS
    totalDislikes: Float! # DOES NOT EXIST FOR COMMENT CREATE; FOR UI NEEDS
    like: Int # DOES NOT EXIST FOR COMMENT CREATE; FOR UI NEEDS
  }

  type PostComments {
    data: [PostComment]!
    total: Float
  }

  type PostCommentDeletedCount {
    commentDeletedCount: Int!
    replyDeletedCount: Int!
  }

  type UserPostComments { # 'User' is basically a prefix used to avoid naming collision
    postComments: PostComments!
    totalCommentsReplies: Int
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
