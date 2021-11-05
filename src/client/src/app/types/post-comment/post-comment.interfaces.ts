import {UserProfileTeaser} from '~app/types/user/user.interfaces';
import {Observable} from 'rxjs';

export interface PostComment {
  _id: string;
  userId: string;
  postId: string;
  totalSubcomments: number;
  commentId: string;
  body: string;
  createdAt: number;
}

export interface UIPostComment extends PostComment {
  date: string;
  timeElapsedAfterCreation$: Observable<string>;
  isRecentlyAdded?: boolean;
}

export interface PostCommentCreatePayload {
  postId: string;
  commentId?: string;
  body: string;
}

export interface PostCommentCreateMutationResult {
  createPostComment: PostComment;
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
