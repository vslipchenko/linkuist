import mongoose, {Schema} from 'mongoose';
import {ILinkard} from '@typings/linkard/linkard.interfaces';
import {MongooseDocument, MongooseSchema} from '@typings/mongoose/mongoose.types';

const linkardSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  userId: {type: Schema.Types.ObjectId, required: true},
  link: {type: String, required: true, trim: true},
  note: {type: String, trim: true},
  isPrivate: {type: Boolean, required: true},
  isPaid: {type: Boolean, required: true},
  tags: {type: Array, required: true}, // private or public tag must be presented
} as MongooseSchema<ILinkard>);

export const Linkard = mongoose.model<MongooseDocument<ILinkard>>(
  'Linkard',
  linkardSchema,
  'users.linkards',
);
