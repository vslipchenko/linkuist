export interface PostCreatePayload {
  text: string;
}

export interface PostCreateMutationResult {
  createPost: {
    userId: string;
    // postId: string;
    createdAt: number;
    text: string;
    isRepost: boolean;
  };
}

export interface PostDeleteCountMutationResult {
  deletePost: number;
}

export interface PostsByUserIdQueryResult {
  postsByUserId: {
    posts: {
      data: Array<{
        userId: string;
        createdAt: number;
        // date: string;
        text: string;
        isRepost: boolean;
      }>;
      total: number;
    };
    userProfileTeasers: Array<{_id: string; username: string; profile: {avatarUrl: string}}>;
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
//     userProfileTeasers: Array<{_id: string; username: string; profile: {avatarUrl: string}}>;
//   };
// }
