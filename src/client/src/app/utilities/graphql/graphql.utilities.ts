import {GraphQLError} from "graphql";
import {graphQLError} from "../../models/graphql";

export const getGraphQLErrors = (graphQLErrors: ReadonlyArray<GraphQLError>): graphQLError[] => {
  return graphQLErrors.map(error => ({message: error.message, code: error.extensions.code}));
};
