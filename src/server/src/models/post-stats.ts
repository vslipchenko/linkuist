import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostStats} from '../types/post-stats/post-stats.interface';

const postStatsSchema = new mongoose.Schema({
  postId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  like: {type: Number}, // Represented by the State enum
} as MongooseSchema<IPostStats>);

export const PostStats = mongoose.model<MongooseDocument<IPostStats>>(
  'PostStats',
  postStatsSchema,
  'users.posts.stats',
);
