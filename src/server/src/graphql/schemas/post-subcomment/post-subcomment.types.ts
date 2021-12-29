import {gql} from 'apollo-server-express';

export const postSubcommentTypes = gql`
  type PostSubcomment {
    _id: ID!
    commentId: ID!
    authorId: ID!
    body: String!
    createdAt: Float!
    likes: Int!
  }

  type PostSubcomments {
    data: [PostSubcomment]!
    total: Float!
  }

  type UserPostSubcomments { # 'User' is basically a prefix used to avoid naming collision
    postSubcomments: PostSubcomments!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
