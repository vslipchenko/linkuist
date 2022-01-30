import {gql} from 'apollo-server-express';

export const postReplyTypes = gql`
  type PostReply {
    _id: ID!
    commentId: ID!
    userId: ID!
    body: String!
    createdAt: Float!
    likes: Int # Null for created reply
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
