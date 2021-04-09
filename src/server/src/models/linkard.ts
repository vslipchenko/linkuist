import mongoose, {Schema} from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {ILinkard} from '../types/linkard/linkard.interfaces';

// https://mongoosejs.com/docs/guide.html
const linkardSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  userId: {type: Schema.Types.ObjectId, required: true},
  link: {type: String, required: true, trim: true},
  note: {type: String, trim: true},
  isPrivate: {type: Boolean, required: true},
  isPaid: {type: Boolean, required: true},
  tags: {type: Array, required: true}, // private or public tag must be presented
  metadata: {
    title: {type: String, trim: true},
    sitename: {type: String, trim: true},
    hostname: {type: String, trim: true},
    description: {type: String, trim: true},
    image: {type: String, trim: true},
    icon: {type: String, trim: true},
  } as MongooseSchema<ILinkard['metadata']>,
} as MongooseSchema<ILinkard>);

export const Linkard = mongoose.model<MongooseDocument<ILinkard>>(
  'Linkard',
  linkardSchema,
  'users.linkards',
);
