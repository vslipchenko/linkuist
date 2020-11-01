import {gql} from 'apollo-server-express';

const createLinksCollection = () => {

};

const linkCollectionsTypeDefinitions = gql`
    extend type Mutation {
        createLinksCollection(input: CreateUserMutationInput!): User!
    }
`;

const linkCollectionsMutationResolvers = {
  Mutation: {
    createLinksCollection
  }
};

export {
  linkCollectionsTypeDefinitions,
  linkCollectionsMutationResolvers
};
