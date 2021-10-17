import {Immutable, StoreConfig} from '@ng-estate/store';
import {LinkardsSelectors} from '~app/modules/linkards/store/linkards.selectors';
import {LinkardsGetters} from '~app/modules/linkards/store/linkards.getters';
import {LinkardsActions} from '~app/modules/linkards/store/linkards.actions';
import {LinkardsEffects} from '~app/modules/linkards/store/linkards.effects';
import {LinkardsReducers} from '~app/modules/linkards/store/linkards.reducers';
import {Linkard} from '~app/types/linkard/linkard.interfaces';

export type LinkardsState = Immutable<{
  linkards: Array<Linkard>;
}>;

const LinkardsInitialState: LinkardsState = {
  linkards: [],
};

export const LinkardsStore: StoreConfig<LinkardsState> = {
  id: 'Linkards',
  initialState: LinkardsInitialState,
  selectors: LinkardsSelectors,
  getters: LinkardsGetters,
  actions: LinkardsActions,
  reducers: LinkardsReducers,
  effects: LinkardsEffects,
};
