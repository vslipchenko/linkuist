import {postCommentQueryResolvers, postCommentQueryTypeDefinitions} from './post-comment.queries';
import {
  postCommentMutationResolvers,
  postCommentMutationTypeDefinitions,
} from './post-comment.mutations';
import {postCommentInputs} from './post-comment.inputs';
import {postCommentTypes} from './post-comment.types';

export const postCommentTypeDefinitions = [
  postCommentTypes,
  // postCommentInputs,
  postCommentInputs,
  postCommentQueryTypeDefinitions,
  postCommentMutationTypeDefinitions,
];

export const postCommentResolvers = [postCommentQueryResolvers, postCommentMutationResolvers];
