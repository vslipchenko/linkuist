export interface BookmarkCreateData {
  id: number;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: string;
}
