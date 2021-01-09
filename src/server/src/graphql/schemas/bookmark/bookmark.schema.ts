import {bookmarkInputs} from './bookmark.inputs';
import {bookmarkMutationResolvers, bookmarkMutationTypeDefinitions} from './bookmark.mutations';

export const bookmarkTypeDefinitions = [bookmarkInputs, bookmarkMutationTypeDefinitions];
export const bookmarkResolvers = [bookmarkMutationResolvers];
