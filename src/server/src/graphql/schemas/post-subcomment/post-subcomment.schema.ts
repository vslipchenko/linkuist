import {postSubcommentTypes} from './post-subcomment.types';
import {
  postSubcommentQueryResolvers,
  postSubcommentQueryTypeDefinitions,
} from './post-subcomment.queries';
import {
  postSubcommentMutationResolvers,
  postSubcommentMutationTypeDefinitions,
} from './post-subcomment.mutations';
import {postSubcommentInputs} from './post-subcomment.inputs';

export const postSubcommentTypeDefinitions = [
  postSubcommentTypes,
  // postCommentInputs,
  // postCommentInputs,
  postSubcommentInputs,
  postSubcommentQueryTypeDefinitions,
  postSubcommentMutationTypeDefinitions,
];

export const postSubcommentResolvers = [
  postSubcommentQueryResolvers,
  postSubcommentMutationResolvers,
];
