import {bookmarkInputs} from './bookmark.inputs';
import {bookmarkMutationResolvers, bookmarkMutationTypeDefinitions} from './bookmark.mutations';
import {bookmarkTypes} from './bookmark.types';

export const bookmarkTypeDefinitions = [bookmarkTypes, bookmarkInputs, bookmarkMutationTypeDefinitions];
export const bookmarkResolvers = [bookmarkMutationResolvers];
