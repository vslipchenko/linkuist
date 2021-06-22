export interface IPost {
  id: number; // = new Date().getTime()
  text: string;
  postObjectId: string; // Source post object id
  isRepost: boolean;
}
