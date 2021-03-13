import {linkardInputs} from './linkard.inputs';
import {linkardMutationResolvers, linkardMutationTypeDefinitions} from './linkard.mutations';
import {linkardTypes} from './linkard.types';

export const linkardTypeDefinitions = [linkardTypes, linkardInputs, linkardMutationTypeDefinitions];
export const linkardResolvers = [linkardMutationResolvers];
