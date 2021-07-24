export interface PostCreatePayload {
  text: string;
}

export interface PostCreateMutationResult {
  createPost: {
    postId: string;
    createdAt: number;
    text: string;
    isRepost: boolean;
  };
}

export interface PostsByUserIdQueryResult {
  postsByUserId: Array<{
    createdAt: number;
    text: string;
    isRepost: boolean;
  }>;
}

export interface PostsByUsernameQueryResult {
  postsByUsername: Array<{
    createdAt: number;
    text: string;
    isRepost: boolean;
  }>;
}
