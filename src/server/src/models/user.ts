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
  profile: {
    backgroundUrl: {type: String},
    avatarUrl: {type: String},
    name: {type: String},
    bio: {type: String},
  } as MongooseSchema<IUser['profile']>,
  createdAt: {type: Number, required: true},
  isVerified: {type: Boolean},
} as MongooseSchema<IUser>);

export const User = mongoose.model<MongooseDocument<IUser>>('User', userSchema, 'users');
