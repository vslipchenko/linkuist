import {gql} from 'apollo-server-express';

export const authenticationTypes = gql`
  type JwtTokens {
    accessToken: String!
    refreshToken: String!
  }
`;
