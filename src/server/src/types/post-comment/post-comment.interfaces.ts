export interface IPostComment {
  _id: string;
  authorId: string;
  userId: string;
  postId: string; // Original post object id
  commentId: string; // Original post object id
  body: string;
  likes: number;
  createdAt: number;
}
