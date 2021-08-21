import {gql} from 'apollo-server-express';
import {getUtcTimestamp} from '../../../utilities/date';

export const sharedQueryTypeDefinitions = gql`
  extend type Query {
    clientPreset: ClientPreset!
  }
`;

const clientPreset = (): {serverUtcTimestamp: number} => {
  return {serverUtcTimestamp: getUtcTimestamp()};
};

export const sharedQueryResolvers = {
  Query: {
    clientPreset,
  },
};
