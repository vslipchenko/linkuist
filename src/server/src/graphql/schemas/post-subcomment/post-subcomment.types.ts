import {gql} from 'apollo-server-express';

export const postSubcommentTypes = gql`
  type PostSubcomment {
    _id: ID!
    commentId: ID!
    userId: ID!
    body: String!
    createdAt: Float!
    likes: Int # Null for created subcomment
  }

  type PostSubcomments {
    data: [PostSubcomment]!
    total: Float
  }

  type UserPostSubcomments { # 'User' is basically a prefix used to avoid naming collision
    postSubcomments: PostSubcomments!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
