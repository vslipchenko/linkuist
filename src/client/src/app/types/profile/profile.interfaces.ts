export interface ProfileUpdatePayload {
  backgroundUrl: string;
  avatarUrl: string;
  name: string;
  bio: string;
}

export interface ProfileByUserIdQueryResult {
  profileByUserId: {
    backgroundUrl: string;
    avatarUrl: string;
    name: string;
    bio: string;
  };
}

export interface ProfileByUsernameQueryResult {
  profileByUsername: {
    backgroundUrl: string;
    avatarUrl: string;
    name: string;
    bio: string;
  };
}

export interface ProfileUpdateMutationResult {
  updateProfile: {
    backgroundUrl: string;
    avatarUrl: string;
    name: string;
    bio: string;
  };
}
