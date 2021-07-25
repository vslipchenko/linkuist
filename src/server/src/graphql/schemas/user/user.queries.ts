import {gql, UserInputError} from 'apollo-server-express';
import {EMAIL_REGEXP, USER_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {IUser} from '../../../types/user/user.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {IProfile} from '../../../types/profile/profile.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
// import {Profile} from '../../../models/profile';

export const userQueryTypeDefinitions = gql`
  extend type Query {
    userByEmail(email: String!): User
    userByUsername(username: String!): User
    profileByUserId(userId: String!): UserProfile
    profileByUsername(username: String!): UserProfile # Consider to simplify to just Profile
    profileTeaserByUserId(userId: String!): UserProfileTeaser # Consider to simplify to just ProfileTeaser
    profileTeaserByUsername(userId: String!): UserProfileTeaser
  }
`;

const userByEmail = (_: unknown, {email}: {email: IUser['email']}): unknown => {
  const {isValidData} = checkDataValidity({data: email, pattern: EMAIL_REGEXP});
  if (isValidData) {
    return User.findOne({email});
  }
};

const userByUsername = (_: unknown, {username}: {username: IUser['username']}): unknown => {
  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (isValidData) {
    return User.findOne({username});
  }
};

const profileByUserId = async (
  _: unknown,
  {userId}: {userId: IProfile['userId']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: userId, pattern: USER_ID_REGEXP});
  if (!isValidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');
  console.log('here ', await User.findOne({userId}, 'backgroundUrl avatarUrl name bio'));

  return User.findOne({_id: userId}, 'backgroundUrl avatarUrl name bio');
};

const profileByUsername = async (
  _: unknown,
  {username}: {username: IUser['username']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');

  return User.findOne({username}, 'backgroundUrl avatarUrl name bio');
};

const profileTeaserByUserId = async (
  _: unknown,
  {userId}: {userId: IProfile['userId']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: userId, pattern: USER_ID_REGEXP});
  if (!isValidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');

  return User.findOne({_id: userId}, 'avatarUrl username');
};

const profileTeaserByUsername = async (
  _: unknown,
  {username}: {username: IUser['username']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');

  return User.findOne({username}, 'avatarUrl username');
};

// const userProfileByUsername = (): unknown => {
//   const {isValidData} = {isValidData: true};
//
//   if (!isValidData) return;
//
//   return '';
// };

export const userQueryResolvers = {
  Query: {
    userByEmail,
    userByUsername,
    profileByUserId,
    profileByUsername,
    profileTeaserByUserId,
    profileTeaserByUsername,
  },
};
