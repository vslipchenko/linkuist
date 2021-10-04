export interface Profile {
  backgroundUrl: string;
  avatarUrl: string;
  name: string;
  bio: string;
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
  };
}

// export interface ProfileByUsernameQueryResult {
//   profileByUsername: {
//     profile: {
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
  };
}
