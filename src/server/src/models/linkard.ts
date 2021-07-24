import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {ILinkard} from '../types/linkard/linkard.interfaces';

// https://mongoosejs.com/docs/guide.html
const linkardSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  link: {type: String, required: true},
  note: {type: String},
  isPrivate: {type: Boolean, required: true},
  isPaid: {type: Boolean, required: true},
  tags: {type: Array, required: true}, // private or public tag must be presented
  metadata: {
    title: {type: String},
    sitename: {type: String},
    hostname: {type: String},
    description: {type: String},
    image: {type: String},
    icon: {type: String},
  } as MongooseSchema<ILinkard['metadata']>,
  createdAt: {type: Number, required: true},
} as MongooseSchema<ILinkard>);

export const Linkard = mongoose.model<MongooseDocument<ILinkard>>(
  'Linkard',
  linkardSchema,
  'users.linkards',
);
