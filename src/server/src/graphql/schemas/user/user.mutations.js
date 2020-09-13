const {gql} = require('apollo-server-express');
const {User} = require('../../../models/user');
const bcrypt = require('bcrypt');

/* Resolver declarations */
const createUser = (_, {input}) => {
    input.password = bcrypt.hashSync(input.password, 15);
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
