const {gql} = require('apollo-server-express');

module.exports.userTypes = gql`
    type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
    }
`;
