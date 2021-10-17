import {Immutable, StoreConfig} from '@ng-estate/store';
import {ProfileSelectors} from '~app/modules/profile/store/profile.selectors';
import {ProfileGetters} from '~app/modules/profile/store/profile.getters';
import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {ProfileReducers} from '~app/modules/profile/store/profile.reducers';
import {ProfileEffects} from '~app/modules/profile/store/profile.effects';
import {Profile, ProfileTeasers} from '~app/types/profile/profile.interfaces';

export type ProfileState = Immutable<{
  profile: Profile;
  profileTeasers: ProfileTeasers;
}>;

const ProfileInitialState: ProfileState = {
  profile: {
    backgroundUrl: '',
    avatarUrl: '',
    name: '',
    bio: '',
  },
  profileTeasers: {},
};

export const ProfileStore: StoreConfig<ProfileState> = {
  id: 'Profile',
  initialState: ProfileInitialState,
  selectors: ProfileSelectors,
  getters: ProfileGetters,
  actions: ProfileActions,
  reducers: ProfileReducers,
  effects: ProfileEffects,
} as const;
