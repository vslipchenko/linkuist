import gql from 'graphql-tag';

export const SIGN_IN = gql`
  query($input: SignInQueryInput!) {
    signIn(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const ACCESS_TOKEN_BY_REFRESH_TOKEN = gql`
  query($refreshToken: String!) {
    accessTokenByRefreshToken(refreshToken: $refreshToken)
  }
`;
