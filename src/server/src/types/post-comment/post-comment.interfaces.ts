export interface IPostComment {
  _id: string;
  userId: string;
  postId: string; // Original post object id
  commentId: string; // Original post object id
  body: string;
  likes: number;
  createdAt: number;
}
