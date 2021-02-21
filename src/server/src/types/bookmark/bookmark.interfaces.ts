export interface IBookmark {
  id: number; // = new Date().getTime()
  userId: string;
  link: string;
  title: string;
  image: string;
  icon: string;
  description: string;
  tags: string;
}
