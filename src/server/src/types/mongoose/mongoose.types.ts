import {Document, DocumentDefinition, Schema, SchemaTypeOpts} from 'mongoose';

type SchemaPropertyDefinition = SchemaTypeOpts<DocumentDefinition<unknown>>;

export type MongooseQueryResult<T> = T | null;
export type MongooseDocument<T> = T & Exclude<Document, 'id'>;
export type MongooseSchema<T> = Record<
  keyof T,
  SchemaPropertyDefinition | Schema | {[k: string]: SchemaPropertyDefinition}
>;
