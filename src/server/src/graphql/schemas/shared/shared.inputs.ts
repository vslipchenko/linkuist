import {gql} from 'apollo-server-express';

export const sharedInputs = gql`
  input RequestParameters {
    order: SortOrder
    offset: Float
    limit: Float! # Force limiting
  }
`;
