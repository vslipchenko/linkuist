import {userInputs} from './user.inputs';
import {userTypes} from './user.types';
import {userMutationResolvers, userMutationTypeDefinitions} from './user.mutations';
import {userQueryResolvers, userQueryTypeDefinitions} from './user.queries';

export const userTypeDefinitions = [userTypes, userInputs, userQueryTypeDefinitions, userMutationTypeDefinitions];
export const userResolvers = [userQueryResolvers, userMutationResolvers];
