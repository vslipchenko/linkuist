import mongoose from 'mongoose';
import {MongooseDocument} from '../types/mongoose/mongoose.types';
import {IPost} from '../types/post/post.interfaces';

const postSchema = new mongoose.Schema({
  id: {type: Number, required: true, unique: true},
  text: {type: String, trim: true},
  postObjectId: {type: mongoose.Schema.Types.ObjectId}, // Original post ObjectId reference
  isRepost: {type: Boolean, required: true},
});

export const Post = mongoose.model<MongooseDocument<IPost>>('Post', postSchema, 'posts');
