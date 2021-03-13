export interface IBookmark {
  id: number; // = new Date().getTime()
  userId: string;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: string;
}
