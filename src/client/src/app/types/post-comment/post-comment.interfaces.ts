import {UserProfileTeaser} from '~app/types/user/user.interfaces';
import {Observable} from 'rxjs';

export interface PostCommentBase {
  _id: string;
  userId: string;
  postId: string;
  // commentId?: string; // is null for subcomments
  body: string;
  createdAt: number;
}

interface PostComment extends PostCommentBase {
  totalSubcomments: number;
}

export interface UIPostCommentBase {
  date: string;
  timeElapsedAfterCreation$: Observable<string>;
  isRecentlyAdded?: boolean; // Flag that symbolized that record was created recently and may be out of order
  // hasToBeSkippedByApi?: boolean;
}

export interface UIPostComment extends PostComment, UIPostCommentBase {
  totalSubcomments: number; // Absent for subcomments
}

export interface PostCommentCreatePayload {
  postId: string;
  // commentId?: string;
  body: string;
}

export interface PostCommentCreateMutationResult {
  createPostComment: PostCommentBase;
}

export interface PostCommentsByPostIdQueryResult {
  postCommentsByPostId: {
    postComments: {
      data: Array<PostComment>;
      total: number;
    };
    totalCommentsSubcomments: number;
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}

export interface DeletePostCommentMutationResult {
  deletePostComment?: {
    commentDeletedCount: number;
    subcommentDeletedCount: number;
  };
}
