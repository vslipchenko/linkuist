import {VoidResolver, VoidTypeDefinition} from './void.scalar';

export const scalarTypeDefinitions = [VoidTypeDefinition];

export const scalarResolvers = [{[VoidResolver.name]: VoidResolver}];
