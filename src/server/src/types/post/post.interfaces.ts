export interface IPost {
  createdAt: number; // = new Date().getTime()
  text: string;
  postId: string; // Source post object id
  isRepost: boolean;
}
