import {gql} from 'apollo-server-express';

export const sharedEnums = gql`
  enum SortOrder {
    ascending
    descending
  }
`;
