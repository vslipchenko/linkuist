import {gql} from 'apollo-server-express';

export const postTypes = gql`
  type Post {
    _id: ID!
    text: String
    postId: String
    isRepost: Boolean!
    createdAt: Float!
  }

  type PostByUserId {
    data: [Post]!
    total: Float
  }
`;
