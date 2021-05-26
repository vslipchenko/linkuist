// eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface Linkard {
//   id: number;
//   metadata: LinkardMetadata;
// }

export interface LinkardPreview {
  id: number;
  note: string;
  metadata: LinkardMetadata;
}

interface LinkardMetadata {
  hostname: string;
  sitename: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

interface LinkardTag {
  text: string;
}

export interface LinkardCreatePayload {
  id: number;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: Array<LinkardTag>;
}

export interface LinkardsByUserIdQueryResult {
  linkardsByUserId: Array<{
    id: number;
    note: string;
    metadata: LinkardMetadata;
  }>;
}

export interface LinkardsByUsernameQueryResult {
  linkardsByUsername: Array<{
    id: number;
    note: string;
    metadata: LinkardMetadata;
  }>;
}
