import mongoose from 'mongoose';
import {IUser} from '../types/user/user.interfaces';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  accessKey: {
    type: String,
    required: true,
    index: {
      unique: true, // allow duplicate null values
      partialFilterExpression: {accessKey: {$type: 'string'}},
    },
  },
  createdAt: {type: Number, required: true},
} as MongooseSchema<IUser>);

export const User = mongoose.model<MongooseDocument<IUser>>('User', userSchema, 'users');
