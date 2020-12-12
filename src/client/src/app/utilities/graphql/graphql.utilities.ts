import {GraphQLError} from "graphql";
import {graphQLError} from '@@types/graphql/graphql';

export const shapeGraphQLErrors = (graphQLErrors: ReadonlyArray<GraphQLError>): graphQLError[] => {
  return graphQLErrors.map(error => ({message: error.message, code: error.extensions.code}));
};
