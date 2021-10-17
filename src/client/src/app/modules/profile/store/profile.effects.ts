import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {EffectOptions, Effects} from '@ng-estate/store';
import {ProfileState} from '~app/modules/profile/store/index';
import {
  Profile,
  ProfileByUserIdQueryResult,
  ProfileUpdateMutationResult,
} from '~app/types/profile/profile.interfaces';
import {UserService} from '~app/services/user/user.service';
import {tap} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {ApolloQueryResult} from '@apollo/client/core/types';

export const ProfileEffects: Effects<ProfileState> = {
  [ProfileActions.updateProfile]: ({
    dispatch,
    payload,
    injector,
  }: EffectOptions<ProfileState, Profile>) => {
    const userService = injector.get(UserService);

    return userService.updateProfile(payload).pipe(
      tap(({data}: FetchResult<ProfileUpdateMutationResult>) => {
        dispatch(ProfileActions.setUserProfile, data!.updateProfile.profile);
      }),
    );
  },
  [ProfileActions.getProfileByUserId]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<ProfileState, string>) => {
    const userService = injector.get(UserService);

    return userService.getProfileByUserId(payload).pipe(
      tap(({data}: ApolloQueryResult<ProfileByUserIdQueryResult>) => {
        const profile = data.profileByUserId.profile;

        dispatch(ProfileActions.setUserProfile, profile);
      }),
    );
  },
};
