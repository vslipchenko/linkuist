import {FetchedMetadata} from '../../utilities/url-metadata';

interface ILinkardTag {
  text: string;
}

export interface ILinkard {
  id: number; // = new Date().getTime()
  userId: string;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: Array<ILinkardTag>;
  metadata: FetchedMetadata;
}
