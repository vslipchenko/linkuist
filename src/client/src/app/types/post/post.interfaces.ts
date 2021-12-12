import {Observable} from 'rxjs';
import {UserProfileTeaser} from '~app/types/user/user.interfaces';

export interface PostCreatePayload {
  text: string;
}

interface Post {
  _id: string;
  userId: string;
  createdAt: number;
  text: string;
  isRepost: boolean;
  totalComments: number;
}

export interface UIPost extends Post {
  date: string;
  timeElapsedAfterCreation$: Observable<string>;
  // timeElapsedAfterCreation: string;
}

export interface PostCreateMutationResult {
  createPost: Post;
}

export interface PostDeleteCountMutationResult {
  deletePost: {
    postDeletedCount: number;
    commentDeletedCount: number;
  };
}

// export interface PostCommentCreatePayload {
//   body: string;
//   postId: string;
// }

export interface PostsByUserIdQueryResult {
  postsByUserId: {
    posts: {
      data: Array<Post>;
      total: number;
    };
    userProfileTeasers: Array<UserProfileTeaser>;
  };
}

// export interface PostsByUsernameQueryResult {
//   postsByUsername: {
//     posts: {
//       data: Array<{
//         userId: string;
//         createdAt: number;
//         // date: string;
//         text: string;
//         isRepost: boolean;
//       }>;
//       total: number;
//     };
//     userProfileTeasers: Array<{_id: string; username: string; _profile: {avatarUrl: string}}>;
//   };
// }
