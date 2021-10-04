export interface PostCommentCreatePayload {
  postId: string;
  body: string;
}

export interface PostCommentCreateMutationResult {
  createPostComment: {
    _id: string;
  };
}
