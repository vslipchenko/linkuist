export interface IPost {
  _id: string;
  userId: string;
  createdAt: number; // = new Date().getTime()
  text: string;
  postId: string; // Source post object id
  isRepost: boolean;
}
