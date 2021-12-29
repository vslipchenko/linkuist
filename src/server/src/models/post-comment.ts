import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostComment} from '../types/post-comment/post-comment.interfaces';

// Idea https://stackoverflow.com/questions/45833804/suggested-table-structure-for-one-level-deep-nested-comment
const postCommentSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true}, // Comment author id
  postId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}, // required ?? Original post id
  commentId: {type: mongoose.Schema.Types.ObjectId, index: true}, // Parent comment id, null for root comment
  body: {type: String, required: true},
  likes: {type: Number, default: 0},
  createdAt: {type: Number, required: true},
} as MongooseSchema<IPostComment>);

export const PostComment = mongoose.model<MongooseDocument<IPostComment>>(
  'PostComment',
  postCommentSchema,
  'users.posts.comments',
);
