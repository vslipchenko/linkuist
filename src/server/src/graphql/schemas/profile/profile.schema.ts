import {profileTypes} from './profile.types';
import {profileInputs} from './profile.inputs';
import {profileMutationResolvers, profileMutationTypeDefinitions} from './profile.mutations';
import {profileQueryResolvers, profileQueryTypeDefinitions} from './profile.queries';

export const profileTypeDefinitions = [
  profileTypes,
  profileInputs,
  profileQueryTypeDefinitions,
  profileMutationTypeDefinitions,
];

export const profileResolvers = [profileQueryResolvers, profileMutationResolvers];
