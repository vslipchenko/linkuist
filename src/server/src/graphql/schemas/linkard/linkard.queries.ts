import {gql} from 'apollo-server-express';
import {Linkard} from '../../../models/linkard';
// import {authenticationGuard} from '../../../utilities/guards';
import {checkDataValidity} from '../../../utilities/validators';
import {USERNAME_REGEXP} from '../../../constants/regexps';
import {ILinkard} from '../../../types/linkard/linkard.interfaces';

const linkardsByUsername = async (
  _: unknown,
  {username}: {username: ILinkard['username']},
): // {accessToken}: {accessToken: string},
Promise<unknown> => {
  // const {error} = await authenticationGuard(accessToken);
  // if (error) return error;

  const {isValidData} = checkDataValidity({data: username, pattern: USERNAME_REGEXP});
  if (!isValidData) return Promise.reject();

  return Linkard.find({
    username,
  });
};

export const linkardQueryTypeDefinitions = gql`
  extend type Query {
    linkardsByUsername(username: String!): [Linkard]!
  }
`;

export const linkardQueryResolvers = {
  Query: {
    linkardsByUsername,
  },
};
