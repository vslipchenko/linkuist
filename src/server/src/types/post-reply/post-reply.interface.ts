import {IPostComment} from '../post-comment/post-comment.interfaces';

export interface IPostCommentReply extends IPostComment {
  commentId: string; // Original post object id
}
