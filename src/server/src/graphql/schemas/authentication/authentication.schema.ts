import {authenticationInputs} from './authentication.inputs';
import {authenticationTypes} from './authentication.types';
import {authenticationQueryTypeDefinitions, authenticationQueryResolvers} from './authentication.queries';

export const authenticationTypeDefinitions = [
  authenticationTypes,
  authenticationInputs,
  authenticationQueryTypeDefinitions
];
export const authenticationResolvers = [authenticationQueryResolvers];
