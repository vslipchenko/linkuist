import {UserProfileTeaser} from '~app/types/user/user.interfaces';
import {Observable} from 'rxjs';

interface PostComment {
  _id: string;
  userId: string;
  postId: string;
  body: string;
  createdAt: number;
}

interface PostCommentBase {
  date: string;
  timeElapsedAfterCreation$: Observable<string>;
  isRecentlyAdded?: boolean;
}

export interface UIPostComment extends PostComment, PostCommentBase {
  totalSubcomments: number; // Absent for subcomments
}

export interface UIPostSubcomment extends PostComment, PostCommentBase {
  commentId: string;
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
