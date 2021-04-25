import {linkardInputs} from './linkard.inputs';
import {linkardMutationResolvers, linkardMutationTypeDefinitions} from './linkard.mutations';
import {linkardTypes} from './linkard.types';
import {linkardQueryResolvers, linkardQueryTypeDefinitions} from './linkard.queries';

export const linkardTypeDefinitions = [
  linkardTypes,
  linkardInputs,
  linkardQueryTypeDefinitions,
  linkardMutationTypeDefinitions,
];
export const linkardResolvers = [linkardQueryResolvers, linkardMutationResolvers];
