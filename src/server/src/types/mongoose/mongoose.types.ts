import {Document, SchemaDefinitionProperty} from 'mongoose';

export type MongooseQueryResult<T> = T | null;
export type MongooseDocument<T> = T & Document;
export type MongooseSchema<T> = Record<keyof T, SchemaDefinitionProperty>;
