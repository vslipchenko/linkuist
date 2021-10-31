import {UserProfileTeaser} from '~app/types/user/user.interfaces';

export interface PostComment {
  _id: string;
  userId: string;
  totalSubcomments: number;
  commentId: string;
  body: string;
  createdAt: number;
}

export interface PostCommentCreatePayload {
  postId: string;
  commentId?: string;
  body: string;
}

export interface PostCommentCreateMutationResult {
  createPostComment: {
    _id: string;
  };
}

export interface PostCommentsByPostIdQueryResult {
  postCommentsByPostId: {
    postComments: {
      data: Array<PostComment>;
      total: number;
    };
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}
