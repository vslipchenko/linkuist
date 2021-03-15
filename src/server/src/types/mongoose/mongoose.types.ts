import {Document, DocumentDefinition, SchemaTypeOpts} from 'mongoose';

export type MongooseQueryResult<T> = T | null;
export type MongooseDocument<T> = T & Exclude<Document, 'id'>;
export type MongooseSchema<T> = Record<keyof T, SchemaTypeOpts<DocumentDefinition<unknown>>>;
