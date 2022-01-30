import {UserProfileTeaser} from '~app/types/user/user.interfaces';
import {PostCommentBase, UIPostCommentBase} from '~app/types/post-comment/post-comment.interfaces';

export interface PostRepliesByCommentIdQueryResult {
  postRepliesByCommentId: {
    postReplies: {
      data: Array<PostCommentBase>;
      total: number;
    };
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}

export interface PostReplyCreatePayload {
  postId: string;
  commentId: string;
  // commentId?: string;
  body: string;
}

export interface PostReplyCreateMutationResult {
  createPostReply: PostCommentBase;
}

export interface UIPostReply extends Omit<PostCommentBase, 'postId'>, UIPostCommentBase {
  commentId: string;
}

export interface DeletePostReplyMutationResult {
  deletePostReply?: number;
}
