import {Getters} from '@ng-estate/store';
import {LinkardsState} from '~app/modules/linkards/store/index';
import {LinkardsSelectors} from '~app/modules/linkards/store/linkards.selectors';

export const LinkardsGetters: Getters<LinkardsState> = {
  [LinkardsSelectors.getLinkards]: (state) => state.linkards,
};
