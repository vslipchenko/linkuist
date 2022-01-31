import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostCommentStats} from '../types/post-comment-stats/post-comment-stats.interface';

const postCommentStatsSchema = new mongoose.Schema({
  // TODO: review index relevance
  commentId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  like: {type: Number, required: true}, // Represented by the State enum
} as MongooseSchema<IPostCommentStats>);

export const PostCommentStats = mongoose.model<MongooseDocument<IPostCommentStats>>(
  'PostCommentStats',
  postCommentStatsSchema,
  'users.posts.comments.stats',
);
