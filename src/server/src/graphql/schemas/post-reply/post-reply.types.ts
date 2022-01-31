import {gql} from 'apollo-server-express';

export const postReplyTypes = gql`
  type PostReply {
    _id: ID!
    commentId: ID!
    userId: ID!
    body: String!
    createdAt: Float!
    totalLikes: Float! # DOES NOT EXIST FOR REPLY CREATE; FOR UI NEEDS
    totalDislikes: Float! # DOES NOT EXIST FOR REPLY CREATE; FOR UI NEEDS
    like: Int # DOES NOT EXIST FOR REPLY CREATE; FOR UI NEEDS
  }

  type PostReplies {
    data: [PostReply]!
    total: Float
  }

  type UserPostReplies { # 'User' is basically a prefix used to avoid naming collision
    postReplies: PostReplies!
    userProfileTeasers: [UserProfileTeaser!]!
  }
`;
