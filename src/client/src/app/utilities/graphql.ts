import {GraphQLError} from 'graphql';
import {GraphQLCustomError} from '@typings/graphql/graphql.interfaces';

export const shapeGraphQLErrors = (
  graphQLErrors: ReadonlyArray<GraphQLError>,
): Array<GraphQLCustomError> => {
  return graphQLErrors.map((error) => ({message: error.message, code: error.extensions?.code}));
};
