import {postStatsMutationResolvers, postStatsMutationTypeDefinitions} from './post-stats.mutations';
import {postStatsTypes} from './post-stats.types';
import {postStatsInputs} from './post-stats.inputs';

export const postStatsTypeDefinitions = [
  postStatsTypes,
  postStatsInputs,
  postStatsMutationTypeDefinitions,
];

export const postStatsResolvers = [postStatsMutationResolvers];
