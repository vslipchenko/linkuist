import {postReplyStatsTypes} from './post-reply-stats.types';
import {postReplyStatsInputs} from './post-reply-stats.inputs';
import {
  postReplyStatsMutationResolvers,
  postReplyStatsMutationTypeDefinitions,
} from './post-reply-stats.mutations';

export const postReplyStatsTypeDefinitions = [
  postReplyStatsTypes,
  postReplyStatsInputs,
  postReplyStatsMutationTypeDefinitions,
];

export const postReplyStatsResolvers = [postReplyStatsMutationResolvers];
