import {ProfileSelectors} from '~app/modules/profile/store/profile.selectors';
import {ProfileState} from '~app/modules/profile/store/index';
import {Getters} from '@ng-estate/store';
// import {Profile} from '~app/types/profile/profile.interfaces';

export const ProfileGetters: Getters<ProfileState> = {
  [ProfileSelectors.getProfile]: (state) => state.profile,
  [ProfileSelectors.getProfileTeasers]: (state) => state.profileTeasers,
};
