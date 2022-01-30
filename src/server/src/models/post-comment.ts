import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostComment} from '../types/post-comment/post-comment.interfaces';

// Idea https://stackoverflow.com/questions/45833804/suggested-table-structure-for-one-level-deep-nested-comment
const postCommentSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true}, // Comment author id
  postId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}, // required ?? Original post id
  body: {type: String, required: true},
  createdAt: {type: Number, required: true},
} as MongooseSchema<IPostComment>);

export const PostComment = mongoose.model<MongooseDocument<IPostComment>>(
  'PostComment',
  postCommentSchema,
  'users.posts.comments',
);
