import mongoose, {Schema} from 'mongoose';
import {IBookmark} from '../types/bookmark/bookmark.interfaces';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';

const bookmarkSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  userId: {type: Schema.Types.ObjectId, required: true},
  link: {type: String, required: true, trim: true},
  note: {type: String, trim: true},
  isPrivate: {type: Boolean, required: true},
  isPaid: {type: Boolean, required: true},
  tags: {type: Array, required: true}, // private or public tag must be presented
} as MongooseSchema<IBookmark>);

export const Bookmark = mongoose.model<MongooseDocument<IBookmark>>(
  'Bookmark',
  bookmarkSchema,
  'users.bookmarks',
);
