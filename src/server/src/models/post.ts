import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPost} from '../types/post/post.interfaces';

const postSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}, // Post author id
  text: {type: String}, // Required if isRepost = true // TODO rename to 'body'
  postId: {type: mongoose.Schema.Types.ObjectId}, // Original post ObjectId reference
  createdAt: {type: Number, required: true},
} as MongooseSchema<IPost>);

export const Post = mongoose.model<MongooseDocument<IPost>>('Post', postSchema, 'users.posts');
