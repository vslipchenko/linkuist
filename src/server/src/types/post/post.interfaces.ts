export interface IPost {
  _id: string;
  userId: string;
  createdAt: number;
  text: string;
  likes: number;
  postId: string; // Source post object id
  isRepost: boolean;
}
