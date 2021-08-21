import {sharedEnums} from './shared.enums';
import {sharedInputs} from './shared.inputs';
import {sharedTypes} from './shared.types';
import {sharedQueryResolvers, sharedQueryTypeDefinitions} from './shared.queries';
// import {sharedTypes} from './shared.types';
// import {sharedInterfaces} from './shared.interfaces';

export const sharedTypeDefinitions = [
  sharedEnums,
  sharedInputs,
  sharedTypes,
  sharedQueryTypeDefinitions,
];

export const sharedResolvers = [sharedQueryResolvers];
