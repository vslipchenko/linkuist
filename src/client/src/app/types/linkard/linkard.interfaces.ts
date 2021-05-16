// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Linkard {
  id: number;
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

export interface LinkardCreatePayload {
  id: number;
  link: string;
  note: string;
  isPrivate: boolean;
  isPaid: boolean;
  tags: Array<string>;
}

export interface LinkardsByUserIdQueryResult {
  linkardsByUserId: Array<{
    id: number;
    metadata: LinkardMetadata;
  }>;
}

export interface LinkardsByUsernameQueryResult {
  linkardsByUsername: Array<{
    id: number;
    metadata: LinkardMetadata;
  }>;
}
