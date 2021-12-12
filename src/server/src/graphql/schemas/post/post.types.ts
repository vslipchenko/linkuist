import {gql} from 'apollo-server-express';

export const postTypes = gql`
  # Extended
  type Post {
    _id: ID!
    userId: ID!
    text: String
    # postId: String
    isRepost: Boolean!
    likes: Int!
    createdAt: Float!
    totalComments: Int! # DOES NOT EXIST FOR POST CREATE BUT IS USED THERE
  }

  # Consider rename to Post
  # type PostItem {
  #  userId: String!
  #  text: String
  #  isRepost: Boolean!
  #  date: String!
  # }

  type Posts {
    # data: [PostItem]!
    data: [Post]!
    total: Float!
  }

  type PostDeletedCount {
    postDeletedCount: Int!
    commentDeletedCount: Int!
  }

  type UserPosts {
    posts: Posts!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
