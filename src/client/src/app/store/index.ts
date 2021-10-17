import {Immutable, StoreRootConfig} from '@ng-estate/store';
import {AppSelectors} from '~app/store/app.selectors';
import {AppGetters} from '~app/store/app.getters';
import {AppActions} from '~app/store/app.actions';
import {AppReducers} from '~app/store/app.reducers';
// import {AppEffects} from '~app/store/app.effects';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {UserRole} from '~app/types/user/user.enums';

export type AppState = Immutable<{
  resolvedUser: ResolvedUser;
}>;

const AppInitialState: AppState = {
  resolvedUser: {
    id: '',
    urlUsername: '',
    role: UserRole.GUEST,
  },
};

export const AppStore: StoreRootConfig<AppState> = {
  id: 'App',
  initialState: AppInitialState,
  selectors: AppSelectors,
  getters: AppGetters,
  actions: AppActions,
  reducers: AppReducers,
  // effects: AppEffects,
} as const;
