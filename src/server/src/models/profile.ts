import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IProfile} from '../types/profile/profile.interfaces';

const profileSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true}, // Unique constraint is used to force single record limit record per user
  backgroundUrl: {type: String, required: true},
  avatarUrl: {type: String, required: true},
  name: {type: String, required: true},
  bio: {type: String, required: true},
} as MongooseSchema<IProfile>);

export const Profile = mongoose.model<MongooseDocument<IProfile>>(
  'Profile',
  profileSchema,
  'users.profile',
);
