import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostReplyStats} from '../types/post-reply-stats/post-reply-stats.interfaces';

const postReplyStatsSchema = new mongoose.Schema({
  // TODO: review index relevance
  replyId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  like: {type: Number, required: true}, // Represented by the State enum
} as MongooseSchema<IPostReplyStats>);

export const PostReplyStats = mongoose.model<MongooseDocument<IPostReplyStats>>(
  'PostReplyStats',
  postReplyStatsSchema,
  'users.posts.comments.replies.stats',
);
