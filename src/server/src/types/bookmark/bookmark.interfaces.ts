import {Document} from 'mongoose';

export interface BookmarkInterface {
  id: string;
  userId: string;
  link: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  tags: string;
}

export interface BookmarkDocument extends BookmarkInterface, Document {}
