import {GraphQLError} from 'graphql';
import {GraphQLCustomError} from '~app/types/graphql/graphql.interfaces';

export const extractGraphQLErrors = (
  graphQLErrors: ReadonlyArray<GraphQLError>,
): Array<GraphQLCustomError> => {
  return graphQLErrors.map((error) => ({message: error.message, code: error.extensions?.code}));
};
