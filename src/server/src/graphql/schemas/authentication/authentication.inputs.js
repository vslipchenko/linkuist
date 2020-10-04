const {gql} = require('apollo-server-express');

module.exports.authenticationInputs = gql`
    input SignInQueryInput {
        email: String!
        password: String!
    }
`;
