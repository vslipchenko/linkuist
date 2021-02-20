import mongoose, {Schema, SchemaTypeOpts} from 'mongoose';
import {ObjectKeysOfAndValues} from '../types/utility/utility.types';
import {BookmarkDocument, IBookmark} from '../types/bookmark/bookmark.interfaces';

const bookmarkSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  userId: {type: Schema.Types.ObjectId, required: true},
  link: {type: String, required: true, trim: true},
  title: {type: String, trim: true},
  image: {type: String, trim: true},
  icon: {type: String, trim: true},
  description: {type: String, trim: true},
  tags: {type: Array, required: true}, // private or public tag must be presented
} as ObjectKeysOfAndValues<IBookmark, SchemaTypeOpts<any>>);

export const Bookmark = mongoose.model<BookmarkDocument>(
  'Bookmark',
  bookmarkSchema,
  'users.bookmarks',
);
