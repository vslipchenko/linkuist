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
  postsByUserId: {
    data: Array<{
      createdAt: number;
      text: string;
      isRepost: boolean;
    }>;
    total: number;
  };
}

export interface PostsByUsernameQueryResult {
  postsByUsername: {
    data: Array<{
      createdAt: number;
      text: string;
      isRepost: boolean;
    }>;
    total: number;
  };
}
