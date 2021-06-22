import {gql} from 'apollo-server-express';

export const postTypes = gql`
  type Post {
    _id: ID!
  }
`;
