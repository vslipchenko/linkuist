import {ReducerResult, Reducers} from '@ng-estate/store';
import {LinkardsState} from '~app/modules/linkards/store/index';
import {LinkardsActions} from '~app/modules/linkards/store/linkards.actions';
import {Linkard} from '~app/types/linkard/linkard.interfaces';

export const LinkardsReducers: Reducers<LinkardsState> = {
  [LinkardsActions.appendLinkards]: (
    state,
    linkards: Array<Linkard>,
  ): ReducerResult<LinkardsState> => ({
    ...state,
    linkards: [...state.linkards, ...linkards],
  }),
  [LinkardsActions.prependLinkard]: (state, linkard: Linkard): ReducerResult<LinkardsState> => ({
    ...state,
    linkards: [linkard, ...state.linkards],
  }),
};
