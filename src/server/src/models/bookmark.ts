import mongoose, {SchemaTypeOpts} from 'mongoose';
// import {UserDocument, UserInterface} from '../types/user/user.interfaces';
import {KeysAndValues} from '../types/app/app.types';
import {BookmarkDocument, BookmarkInterface} from '../types/bookmark/bookmark.interfaces';

const bookmarkSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  userId: {type: String, required: true},
  link: {type: String, required: true, unique: true, trim: true},
  title: {
    type: String, trim: true,
    index: {
      unique: true, // allow duplicate null values
      partialFilterExpression: {accessKey: {$type: 'string'}}
    }
  },
  thumbnailUrl: {type: String, trim: true},
  description: {type: String, trim: true},
  tags: {type: String, trim: true}
} as KeysAndValues<BookmarkInterface, SchemaTypeOpts<any>>);

export const Bookmark = mongoose.model<BookmarkDocument>('Bookmark', bookmarkSchema, 'users.bookmarks');
