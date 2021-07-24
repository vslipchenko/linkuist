import {postMutationResolvers, postMutationTypeDefinitions} from './post.mutations';
import {postInputs} from './post.inputs';
import {postTypes} from './post.types';
import {postQueryResolvers, postQueryTypeDefinitions} from './post.queries';

export const postTypeDefinitions = [
  postTypes,
  postInputs,
  postQueryTypeDefinitions,
  postMutationTypeDefinitions,
];

export const postResolvers = [postQueryResolvers, postMutationResolvers];
