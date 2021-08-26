import mongoose from 'mongoose';
import {MongooseDocument} from '../types/mongoose/mongoose.types';
import {IPost} from '../types/post/post.interfaces';

const postSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  text: {type: String}, // Required if isRepost = true // TODO rename to 'body'
  postId: {type: mongoose.Schema.Types.ObjectId}, // Original post ObjectId reference
  isRepost: {type: Boolean, required: true},
  createdAt: {type: Number, required: true},
});

export const Post = mongoose.model<MongooseDocument<IPost>>('Post', postSchema, 'users.posts');
