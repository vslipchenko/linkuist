import {FetchedMetadata} from '../../utilities/url-metadata';

export interface ILinkard {
  id: number; // = new Date().getTime()
  username: string;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: string;
  metadata: FetchedMetadata;
}
