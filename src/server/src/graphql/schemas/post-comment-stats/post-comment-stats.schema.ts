import {
  postCommentStatsMutationResolvers,
  postCommentStatsMutationTypeDefinitions,
} from './post-comment-stats.mutations';
import {postCommentStatsTypes} from './post-comment-stats.types';
import {postCommentStatsInputs} from './post-comment-stats.inputs';

export const postCommentStatsTypeDefinitions = [
  postCommentStatsTypes,
  postCommentStatsInputs,
  postCommentStatsMutationTypeDefinitions,
];

export const postCommentStatsResolvers = [postCommentStatsMutationResolvers];
