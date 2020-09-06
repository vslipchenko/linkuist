const {gql} = require('apollo-server-express');
const {User} = require('../../../models/user');

/* Resolver declarations */
const createUser = (_, {input}) => {
    return User.create(input);
};

const userMutationTypeDefs = gql`
    extend type Mutation {
        createUser(input: CreateUserMutationInput!): User!
    }
`;

const userMutationResolvers = {
    Mutation: {
        createUser
    }
};

module.exports = {
    userMutationTypeDefs,
    userMutationResolvers
}
