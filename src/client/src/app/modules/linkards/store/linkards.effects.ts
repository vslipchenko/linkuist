import {EffectOptions, Effects} from '@ng-estate/store';
import {LinkardsState} from '~app/modules/linkards/store/index';
import {LinkardsActions} from '~app/modules/linkards/store/linkards.actions';
import {LinkardService} from '~app/services/linkard/linkard.service';
import {tap} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {
  LinkardCreateMutationResult,
  LinkardCreatePayload,
  LinkardsByUserIdQueryResult,
} from '~app/types/linkard/linkard.interfaces';

export const LinkardsEffects: Effects<LinkardsState> = {
  [LinkardsActions.loadLinkards]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<LinkardsState, {resolvedUserId: string}>) => {
    const linkardService = injector.get(LinkardService);

    return linkardService.getAllByUserId(payload.resolvedUserId).pipe(
      tap(({data}: ApolloQueryResult<LinkardsByUserIdQueryResult>) => {
        dispatch(LinkardsActions.appendLinkards, data.linkardsByUserId);
      }),
    );
  },
  [LinkardsActions.createLinkard]: ({
    payload,
    dispatch,
    injector,
  }: EffectOptions<LinkardsState, LinkardCreatePayload>) => {
    const linkardService = injector.get(LinkardService);

    return linkardService.create(payload).pipe(
      tap(({data}: FetchResult<LinkardCreateMutationResult>) => {
        dispatch(LinkardsActions.prependLinkard, data?.createLinkard);
      }),
    );
  },
};
