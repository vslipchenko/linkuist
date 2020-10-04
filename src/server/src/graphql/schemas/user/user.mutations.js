const {gql} = require('apollo-server-express');
const {User} = require('../../../models/user');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

/* Resolver declarations */
const createUser = (_, {input}) => {
    input.password = bcrypt.hashSync(input.password, 15);
    input.accessKey = uuidv4();
    return User.create(input);
};
// TODO server side validation
const userMutationTypeDefinitions = gql`
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
    userMutationTypeDefinitions,
    userMutationResolvers
}
