import {postCommentQueryResolvers, postCommentQueryTypeDefinitions} from './post-comment.queries';
import {
  postCommentMutationResolvers,
  postCommentMutationTypeDefinitions,
} from './post-comment.mutations';

export const postCommentTypeDefinitions = [
  // postTypes,
  // postInputs,
  postCommentQueryTypeDefinitions,
  postCommentMutationTypeDefinitions,
];

export const postCommentResolvers = [postCommentQueryResolvers, postCommentMutationResolvers];
