import {VoidTypeDefinition, VoidResolver} from './void.scalar';

export const scalarTypeDefinitions = [
  VoidTypeDefinition
];

export const scalarResolvers = [
  {[VoidResolver.name]: VoidResolver}
];
