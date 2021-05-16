import {gql, UserInputError} from 'apollo-server-express';
import {Linkard} from '../../../models/linkard';
// import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {USER_ID_REGEXP, USERNAME_REGEXP} from '../../../constants/regexps';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';
import {IUser} from '../../../types/user/user.interfaces';
import {User} from '../../../models/user';

const linkardsByUserId = async (
  _: unknown,
  {userId}: {userId: ILinkard['userId']},
): // {accessToken}: {accessToken: string},
Promise<unknown> => {
  // const {error} = await authenticationGuard(accessToken);
  // if (error) return error;

  const {isValidData} = checkDataValidity({data: userId, pattern: USER_ID_REGEXP});
  if (!isValidData) return Promise.reject();

  return Linkard.find({
    userId,
  });
};

const linkardsByUsername = async (
  _: unknown,
  {username}: {username: IUser['username']},
): // {accessToken}: {accessToken: string},
Promise<unknown> => {
  // const {error} = await authenticationGuard(accessToken);
  // if (error) return error;

  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return Promise.reject();

  const user = await User.findOne({
    username,
  });

  console.log('user ', user);

  if (!user) return Promise.reject(new UserInputError('Invalid username'));

  return Linkard.find({
    userId: user._id,
  });
};

export const linkardQueryTypeDefinitions = gql`
  extend type Query {
    linkardsByUserId(userId: String!): [Linkard]!
    linkardsByUsername(username: String!): [Linkard]!
  }
`;

export const linkardQueryResolvers = {
  Query: {
    linkardsByUserId,
    linkardsByUsername,
  },
};
