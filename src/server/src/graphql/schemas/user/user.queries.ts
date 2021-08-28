import {gql, UserInputError} from 'apollo-server-express';
import {EMAIL_REGEXP, RECORD_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {User} from '../../../models/user';
import {IUser} from '../../../types/user/user.interfaces';
import {checkDataValidity} from '../../../utilities/validators';
import {IProfile} from '../../../types/profile/profile.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';
// import mongoose from 'mongoose';
// import {Profile} from '../../../models/profile';

export const userQueryTypeDefinitions = gql`
  extend type Query {
    userByEmail(email: String!): User
    userByUsername(username: String!): User
    profileByUserId(userId: String!): UserProfile
    profileByUsername(username: String!): UserProfile # Consider to simplify to just Profile
    # profileTeaserByUserId(userId: String!): UserProfileTeaser # Consider to simplify to just ProfileTeaser
    # profileTeaserByUsername(userId: String!): UserProfileTeaser
  }
`;

const userByEmail = (_: unknown, {email}: {email: IUser['email']}): unknown => {
  const {isInvalidData} = checkDataValidity({data: email, pattern: EMAIL_REGEXP});

  if (isInvalidData) return null;

  return User.findOne({email}).exec();
};

const userByUsername = (_: unknown, {username}: {username: IUser['username']}): unknown => {
  const {isInvalidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});

  if (isInvalidData) return null;

  return User.findOne({username}).exec();
};

const profileByUserId = async (
  _: unknown,
  {userId}: {userId: IProfile['userId']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  // console.log(
  //   'profileByUserId',
  //   (await User.aggregate([
  //     {$match: {_id: mongoose.Types.ObjectId(userId)}},
  //     // {$unwind: '$profile'},
  //     {
  //       $replaceRoot: {
  //         newRoot: '$profile',
  //       },
  //     },
  //   ])),
  // );

  // console.log('profileByUserId', await User.findOne({_id: userId}, 'profile'));

  const {isInvalidData} = checkDataValidity({data: userId, pattern: RECORD_ID_REGEXP});
  if (isInvalidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');
  // console.log('here ', await User.findOne({userId}, 'backgroundUrl avatarUrl name bio'));

  return User.findById(userId, 'profile');
};

const profileByUsername = async (
  _: unknown,
  {username}: {username: IUser['username']},
): Promise<MongooseDocument<IUser> | UserInputError | null> => {
  // console.log('profileByUsername', await User.findOne({username}, 'profile'));

  const {isInvalidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (isInvalidData) return null;

  // const user = await User.findOne({
  //   username,
  // });
  //
  // if (!user) return new UserInputError('Invalid username');
  // console.log('profileByUsername', await User.findOne({username}, 'profile'));

  return User.findOne({username}, 'profile');
};

// const profileTeaserByUserId = async (
//   _: unknown,
//   {userId}: {userId: IProfile['userId']},
// ): Promise<MongooseDocument<IUser> | UserInputError | null> => {
//   const {isInvalidData} = checkDataValidity({data: userId, pattern: USER_ID_REGEXP});
//   if (isInvalidData) return null;
//
//   // const user = await User.findOne({
//   //   username,
//   // });
//   //
//   // if (!user) return new UserInputError('Invalid username');
//
//   return User.findOne({_id: userId}, 'avatarUrl username');
// };
//
// const profileTeaserByUsername = async (
//   _: unknown,
//   {username}: {username: IUser['username']},
// ): Promise<MongooseDocument<IUser> | UserInputError | null> => {
//   const {isInvalidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
//   if (isInvalidData) return null;
//
//   // const user = await User.findOne({
//   //   username,
//   // });
//   //
//   // if (!user) return new UserInputError('Invalid username');
//
//   return User.findOne({username}, 'avatarUrl username');
// };

// const userProfileByUsername = (): unknown => {
//   const {isInvalidData} = {isValidData: true};
//
//   if (isInvalidData) return null;
//
//   return '';
// };

export const userQueryResolvers = {
  Query: {
    userByEmail,
    userByUsername,
    profileByUserId,
    profileByUsername,
    // profileTeaserByUserId,
    // profileTeaserByUsername,
  },
};
