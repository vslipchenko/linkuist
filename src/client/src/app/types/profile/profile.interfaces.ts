export interface Profile {
  backgroundUrl: string;
  avatarUrl: string;
  name: string;
  bio: string;
}

export interface UIProfile extends Profile {
  isVerified: boolean;
}

export interface ProfileUpdatePayload {
  backgroundUrl: string;
  avatarUrl: string;
  name: string;
  bio: string;
}

export interface ProfileByUserIdQueryResult {
  profileByUserId: {
    profile: {
      backgroundUrl: string;
      avatarUrl: string;
      name: string;
      bio: string;
    };
    isVerified: boolean;
  };
}

export interface ProfileTeasers {
  [userId: string]: {avatarUrl: string; username: string; isVerified: boolean};
}

// export interface ProfileByUsernameQueryResult {
//   profileByUsername: {
//     _profile: {
//       backgroundUrl: string;
//       avatarUrl: string;
//       name: string;
//       bio: string;
//     };
//   };
// }

export interface ProfileUpdateMutationResult {
  updateProfile: {
    profile: {
      backgroundUrl: string;
      avatarUrl: string;
      name: string;
      bio: string;
    };
    isVerified: boolean;
  };
}
