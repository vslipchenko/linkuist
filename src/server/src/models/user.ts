import mongoose, {SchemaTypeOpts} from 'mongoose';
import {UserDocument, UserModel} from '../types/user/user.interfaces';
import {KeysAndValues} from '../types/app/app.types';

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true, trim: true},
  username: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true, trim: true},
  accessKey: {
    type: String, required: true, trim: true, index: {
      unique: true, // allow duplicate null values
      partialFilterExpression: {accessKey: {$type: 'string'}}
    }
  }
} as KeysAndValues<UserModel, SchemaTypeOpts<any>>);

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
