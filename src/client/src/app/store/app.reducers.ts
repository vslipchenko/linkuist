import {AppActions} from '~app/store/app.actions';
import {ReducerResult, Reducers} from '@ng-estate/store';
import {AppState} from '~app/store/index';
import {UserRole} from '~app/types/user/user.enums';

export const AppReducers: Reducers<AppState> = {
  [AppActions.setResolvedUserId]: (state, id: string): ReducerResult<AppState> => ({
    ...state,
    resolvedUser: {...state.resolvedUser, id},
  }),
  [AppActions.setResolvedUserRole]: (state, role: UserRole): ReducerResult<AppState> => ({
    ...state,
    resolvedUser: {...state.resolvedUser, role},
  }),
  [AppActions.setResolvedUserUrlUsername]: (
    state,
    urlUsername: string,
  ): ReducerResult<AppState> => ({
    ...state,
    resolvedUser: {...state.resolvedUser, urlUsername},
  }),
};
