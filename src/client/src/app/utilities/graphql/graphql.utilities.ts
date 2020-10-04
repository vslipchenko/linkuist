import {GraphQLError} from "graphql";

export const getGraphQLErrors = (graphQLErrors: ReadonlyArray<GraphQLError>) => {
  return graphQLErrors.map(error => ({message: error.message, code: error.extensions.code}));
};
