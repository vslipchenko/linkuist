const {gql} = require('apollo-server-express');
const {User} = require('../../models/user');

const userMutationTypes = gql`
    extend type Mutation {
        createUser(input: CreateUserMutationInput!): User!
    }
`;

const createUser = (_, {input}) => {
    return User.create(input);
};

const userMutationResolvers = {
    Mutation: {
        createUser
    },
    CreateUserMutationInput: (wow) => console.log('wow ', wow)
};

module.exports = {
    userMutationTypes,
    userMutationResolvers
}
