import gql from 'graphql-tag';

export const GET_CLIENT_PRESET = gql`
  query {
    clientPreset {
      serverUtcTimestamp
    }
  }
`;
