import {UserProfileTeaser} from '~app/types/user/user.interfaces';
import {PostCommentBase, UIPostCommentBase} from '~app/types/post-comment/post-comment.interfaces';

export interface PostSubcommentsByCommentIdQueryResult {
  postSubcommentsByCommentId: {
    postSubcomments: {
      data: Array<PostCommentBase>;
      total: number;
    };
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}

export interface PostSubcommentCreatePayload {
  commentId: string;
  // commentId?: string;
  body: string;
}

export interface PostSubcommentCreateMutationResult {
  createPostSubcomment: PostCommentBase;
}

export interface UIPostSubcomment extends PostCommentBase, UIPostCommentBase {}
