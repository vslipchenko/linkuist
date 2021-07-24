import {IUser} from '../../../types/user/user.interfaces';
import {Profile} from '../../../models/profile';
import {User} from '../../../models/user';
import {gql, UserInputError} from 'apollo-server-express';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
import {IProfile} from '../../../types/profile/profile.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {USER_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';

export const profileQueryTypeDefinitions = gql`
  extend type Query {
    profileByUserId(userId: String!): Profile
    profileByUsername(username: String!): Profile
  }
`;

const profileByUserId = async (
  _: unknown,
  {userId}: {userId: IProfile['userId']},
): Promise<MongooseDocument<IProfile> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: userId, pattern: USER_ID_REGEXP});
  if (!isValidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');

  return Profile.findOne({userId});
};

const profileByUsername = async (
  _: unknown,
  {username}: {username: IUser['username']},
): Promise<MongooseDocument<IProfile> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return null;

  const user = await User.findOne({
    username,
  });

  if (!user) return new UserInputError('Invalid username');

  return Profile.findOne({userId: user._id});
};

export const profileQueryResolvers = {
  Query: {
    profileByUserId,
    profileByUsername,
  },
};
