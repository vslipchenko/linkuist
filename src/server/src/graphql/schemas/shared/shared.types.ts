import {gql} from 'apollo-server-express';
//
// export const sharedTypes = gql`
//   type RequestParameters {
//     order: SortOrder
//     offset: Float
//     limit: Float
//   }
// `;
export const sharedTypes = gql`
  type ClientPreset {
    serverUtcTimestamp: Float!
  }
`;
