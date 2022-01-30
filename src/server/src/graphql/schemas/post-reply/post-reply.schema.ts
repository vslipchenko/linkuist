import {postReplyTypes} from './post-reply.types';
import {postReplyQueryResolvers, postReplyQueryTypeDefinitions} from './post-reply.queries';
import {postReplyMutationResolvers, postReplyMutationTypeDefinitions} from './post-reply.mutations';
import {postReplyInputs} from './post-reply.inputs';

export const postReplyTypeDefinitions = [
  postReplyTypes,
  // postCommentInputs,
  // postCommentInputs,
  postReplyInputs,
  postReplyQueryTypeDefinitions,
  postReplyMutationTypeDefinitions,
];

export const postReplyResolvers = [postReplyQueryResolvers, postReplyMutationResolvers];
