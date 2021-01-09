import {gql} from 'apollo-server-express';

export const bookmarkInputs = gql`
    input CreateBookmarkMutationInput {
        id: String!
        link: String!
        title: String
        thumbnailUrl: String
        description: String
        tags: String
    }
`;
