import {UserProfileTeaser} from '~app/types/user/user.interfaces';

export interface PostComment {
  _id: string;
  userId: string;
  subcommentCount: number;
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
    postComments: Array<PostComment>;
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}
