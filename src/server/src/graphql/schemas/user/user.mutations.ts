import {gql} from 'apollo-server-express';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {EMAIL_REGEXP, PASSWORD_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {IUser} from '../../../types/user/user.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';

/* Resolver declarations */
const createUser = (
  _: unknown,
  {input}: {input: IUser},
): Promise<MongooseDocument<IUser>> | void => {
  const {isValidData} = checkDataValidity({
    data: input,
    pattern: {
      email: EMAIL_REGEXP,
      username: USERNAME_REGEXP,
      password: PASSWORD_REGEXP,
    },
  });

  if (isValidData) {
    input.password = bcrypt.hashSync(input.password, 15);
    input.accessKey = uuidv4();
    return User.create(input);
  }
};
// TODO server side validation
export const userMutationTypeDefinitions = gql`
  extend type Mutation {
    createUser(input: CreateUserMutationInput!): User
  }
`; // User can be nullable in case of invalid input data

export const userMutationResolvers = {
  Mutation: {
    createUser,
  },
};
