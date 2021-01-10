import {Document} from 'mongoose';

export interface BookmarkInterface {
  id: string; // = new Date().getTime()
  userId: string;
  link: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  tags: string;
}

export interface BookmarkDocument extends BookmarkInterface, Document {}
