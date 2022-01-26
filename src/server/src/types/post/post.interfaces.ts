export interface IPost {
  _id: string;
  userId: string;
  createdAt: number;
  text: string;
  postId: string; // Original post id; matters for repost
}
