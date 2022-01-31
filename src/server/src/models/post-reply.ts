import mongoose from 'mongoose';
import {MongooseDocument, MongooseSchema} from '../types/mongoose/mongoose.types';
import {IPostCommentReply} from '../types/post-reply/post-reply.interfaces';

const postCommentReplySchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true}, // Reply author id
  postId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}, // required ?? Original post id
  commentId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}, // Parent comment id, null for root comment
  body: {type: String, required: true},
  createdAt: {type: Number, required: true},
} as MongooseSchema<IPostCommentReply>);

export const PostCommentReply = mongoose.model<MongooseDocument<IPostCommentReply>>(
  'PostCommentReply',
  postCommentReplySchema,
  'users.posts.comments.replies',
);
