import {gql} from 'apollo-server-express';

export const userTypes = gql`
    type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
    }
`;
