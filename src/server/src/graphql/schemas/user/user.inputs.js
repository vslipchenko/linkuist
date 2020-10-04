const {gql} = require('apollo-server-express');

module.exports.userInputs = gql`
    input CreateUserMutationInput {
        email: String!
        username: String!
        password: String!
    }
`;
