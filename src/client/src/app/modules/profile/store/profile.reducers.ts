import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {ProfileState} from '~app/modules/profile/store/index';
import {Profile, ProfileTeasers} from '~app/types/profile/profile.interfaces';

export const ProfileReducers: Reducers<ProfileState> = {
  [ProfileActions.setUserProfile]: (state, profile: Profile): ReducerResult<ProfileState> => ({
    ...state,
    profile,
  }),
  [ProfileActions.patchProfileTeasers]: (
    state,
    teaser: ProfileTeasers,
  ): ReducerResult<ProfileState> => ({
    ...state,
    profileTeasers: {
      ...state.profileTeasers,
      ...teaser,
    },
  }),
};
