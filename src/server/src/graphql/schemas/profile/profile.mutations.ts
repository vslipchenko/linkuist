import {authenticationGuard} from '../../../utilities/guards';
import {IProfile} from '../../../types/profile/profile.interfaces';
import {Profile} from '../../../models/profile';
import {gql} from 'apollo-server-express';

const updateProfile = async (
  _: unknown,
  {input}: {input: Omit<IProfile, 'userId'>},
  {accessToken}: {accessToken: string},
): // ): Promise<MongooseDocument<IProfile> | ApolloError> => {
Promise<unknown> => {
  const {tokenData, error} = await authenticationGuard(accessToken);
  if (error) return error;

  return Profile.findOneAndUpdate({userId: tokenData.userId}, input, {new: true, upsert: true});
  // console.debug('Result ', result);
};

export const profileMutationTypeDefinitions = gql`
  extend type Mutation {
    updateProfile(input: UpdateProfileMutationInput!): Profile
  }
`;

export const profileMutationResolvers = {
  Mutation: {
    updateProfile,
  },
};
