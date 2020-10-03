const {gql} = require('apollo-server-express');

module.exports.userInputs = gql`
    input SignInQueryInput {
        email: String!
        password: String!
    }
    input CreateUserMutationInput {
        email: String!
        username: String!
        password: String!
    }
`;
