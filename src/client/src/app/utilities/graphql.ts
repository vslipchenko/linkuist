import {GraphQLError} from 'graphql';
import {GraphQLCustomError} from '@@types/graphql/graphql.interfaces';

export const shapeGraphQLErrors = (
  graphQLErrors: ReadonlyArray<GraphQLError>,
): Array<GraphQLCustomError> => {
  return graphQLErrors.map((error) => ({message: error.message, code: error.extensions?.code}));
};
