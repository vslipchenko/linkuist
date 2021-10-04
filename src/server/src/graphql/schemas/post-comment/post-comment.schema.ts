import {postCommentQueryResolvers, postCommentQueryTypeDefinitions} from './post-comment.queries';
import {
  postCommentMutationResolvers,
  postCommentMutationTypeDefinitions,
} from './post-comment.mutations';
import {postCommentInputs} from './post-comment.inputs';

export const postCommentTypeDefinitions = [
  // postTypes,
  // postInputs,
  postCommentInputs,
  postCommentQueryTypeDefinitions,
  postCommentMutationTypeDefinitions,
];

export const postCommentResolvers = [postCommentQueryResolvers, postCommentMutationResolvers];
