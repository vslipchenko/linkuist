import {gql} from 'apollo-server-express';
import {Linkard} from '../../../models/linkard';
// import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {RECORD_ID_REGEXP} from '../../../constants/regexps';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {MongooseDocument} from '../../../types/mongoose/mongoose.types';

export const linkardQueryTypeDefinitions = gql`
  extend type Query {
    linkardsByUserId(userId: String!): [Linkard!]!
    # linkardsByUsername(username: String!): [Linkard!]!
  }
`;

const linkardsByUserId = async (
  _: unknown,
  {userId}: {userId: ILinkard['userId']},
): // {accessToken}: {accessToken: string},
Promise<Array<MongooseDocument<ILinkard>> | null> => {
  // const {error} = authenticationGuard(accessToken);
  // if (error) return error;

  const {isInvalidData} = checkDataValidity({data: userId, pattern: RECORD_ID_REGEXP});

  if (isInvalidData) return null;

  return Linkard.find({
    userId,
  });
};

// const linkardsByUsername = async (
//   _: unknown,
//   {username}: {username: IUser['username']},
// ): // {accessToken}: {accessToken: string},
// Promise<Array<MongooseDocument<ILinkard>> | null | UserInputError> => {
//   // const {error} = authenticationGuard(accessToken);
//   // if (error) return error;
//
//   const {isInvalidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
//
//   if (isInvalidData) return null;
//
//   const user = await User.findOne({
//     username,
//   });
//
//   // console.log('user ', user);
//
//   if (!user) return new UserInputError('Invalid username');
//
//   return Linkard.find({
//     userId: user._id,
//   });
// };

export const linkardQueryResolvers = {
  Query: {
    linkardsByUserId,
    // linkardsByUsername,
  },
};
