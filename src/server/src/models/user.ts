import mongoose from 'mongoose';
import {IUser} from '../typings/user/user.interfaces';
import {MongooseDocument, MongooseSchema} from '../typings/mongoose/mongoose.types';

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
} as MongooseSchema<IUser>);

export const User = mongoose.model<MongooseDocument<IUser>>('User', userSchema, 'users');
