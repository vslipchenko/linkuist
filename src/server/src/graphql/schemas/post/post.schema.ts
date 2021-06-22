import {postMutationResolvers, postMutationTypeDefinitions} from './post.mutations';
import {postInputs} from './post.inputs';
import {postTypes} from './post.types';

export const postTypeDefinitions = [postTypes, postInputs, postMutationTypeDefinitions];

export const postResolvers = [postMutationResolvers];
