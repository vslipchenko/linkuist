const {gql} = require('apollo-server-express');

module.exports.authenticationTypes = gql`
    type JwtTokens {
      accessToken: String!
      refreshToken: String!
    }
`;
