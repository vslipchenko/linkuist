import {gql} from 'apollo-server-express';

export const postCommentTypes = gql`
  # Extended
  type PostComment {
    _id: ID!
    postId: ID!
    authorId: ID!
    body: String!
    createdAt: Float!
    likes: Int!
    totalSubcomments: Int!
  }

  type PostComments {
    data: [PostComment]!
    total: Float!
  }

  type PostCommentDeletedCount {
    commentDeletedCount: Int!
    subcommentDeletedCount: Int!
  }

  type UserPostComments { # 'User' is basically a prefix used to avoid naming collision
    postComments: PostComments!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
