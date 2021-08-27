export interface IUser {
  createdAt: number;
  email: string;
  username: string;
  password: string;
  accessKey: string;
  profile: {
    backgroundUrl: string;
    avatarUrl: string;
    name: string;
    bio: string;
  };
}
