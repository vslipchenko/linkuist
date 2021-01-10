import {Document} from 'mongoose';

export interface IBookmark {
  id: string; // = new Date().getTime()
  userId: string;
  link: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  tags: string;
}

export interface BookmarkDocument extends IBookmark, Document {}
