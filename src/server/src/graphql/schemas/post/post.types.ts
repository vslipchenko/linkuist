import {gql} from 'apollo-server-express';

export const postTypes = gql`
  type Post {
    _id: ID!
    userId: String!
    text: String
    # postId: String
    isRepost: Boolean!
    createdAt: Float!
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
    total: Float
  }

  type UserPosts {
    posts: Posts!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
