import mongoose, {SchemaTypeOpts} from 'mongoose';
import {IUser, UserDocument} from '../types/user/user.interfaces';
import {ObjectKeysOfAndValues} from '../types/utility/utility.types';

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true, trim: true},
  username: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true, trim: true},
  accessKey: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true, // allow duplicate null values
      partialFilterExpression: {accessKey: {$type: 'string'}},
    },
  },
} as ObjectKeysOfAndValues<IUser, SchemaTypeOpts<any>>);

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
