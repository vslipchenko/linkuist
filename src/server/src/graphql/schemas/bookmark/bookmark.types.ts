import {gql} from 'apollo-server-express';

export const bookmarkTypes = gql`
    type Bookmark {
        _id: ID!
        id: String!
        userId: String!
        link: String!
        title: String
        thumbnailUrl: String
        description: String
        tags: String!
    }
`;
