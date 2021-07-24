import {Document, DocumentDefinition, Schema, SchemaTypeOpts} from 'mongoose';

type SchemaPropertyDefinition = SchemaTypeOpts<DocumentDefinition<unknown>>;

export type MongooseQueryResult<T> = T | null;
export type MongooseDocument<T> = T & Document;
export type MongooseSchema<T> = Record<
  keyof T,
  SchemaPropertyDefinition | Schema | {[k: string]: SchemaPropertyDefinition}
>;
