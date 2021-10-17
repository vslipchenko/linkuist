import {AppSelectors} from '~app/store/app.selectors';
import {Getters} from '@ng-estate/store';
import {AppState} from '~app/store/index';

export const AppGetters: Getters<AppState> = {
  // [AppSelectors.getResolvedUserId]: (state) => state.resolvedUser.id,
  [AppSelectors.getResolvedUser]: (state) => state.resolvedUser,
};
