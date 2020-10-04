import gql from 'graphql-tag';

export const SIGN_IN = gql`
  query ($input: SignInQueryInput!) {
    signIn(input: $input) {
        accessToken,
        refreshToken
    }
  }
`;
