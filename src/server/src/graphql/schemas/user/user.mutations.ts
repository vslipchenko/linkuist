import {gql} from 'apollo-server-express';
import {User} from '../../../models/user';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {UserModel} from '../../../types/user/user.interfaces';

/* Resolver declarations */
const createUser = (_: unknown, {input}: {input: UserModel}) => {
    input.password = bcrypt.hashSync(input.password, 15);
    input.accessKey = uuidv4();
    return User.create(input);
};
// TODO server side validation
export const userMutationTypeDefinitions = gql`
    extend type Mutation {
        createUser(input: CreateUserMutationInput!): User!
    }
`;

export const userMutationResolvers = {
    Mutation: {
        createUser
    }
};
