import {gql} from 'apollo-server-express';

export const postTypes = gql`
  # Extended
  type Post {
    _id: ID!
    userId: ID!
    text: String
    # postId: String
    createdAt: Float!
    totalComments: Float! # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
    totalCommentsReplies: Float! # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
    totalLikes: Float! # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
    totalDislikes: Float! # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
    totalShares: Float! # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
    like: Int # DOES NOT EXIST FOR POST CREATE; FOR UI NEEDS
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
    replyDeletedCount: Int!
  }

  type UserPosts {
    posts: Posts!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
