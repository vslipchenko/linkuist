import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_CLIENT_PRESET} from '~app/graphql/shared/shared.queries';
import {ClientPresetQueryResult} from '~app/types/shared/shared.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  public constructor(private readonly apollo: Apollo) {}

  public getClientPreset(): Observable<ApolloQueryResult<ClientPresetQueryResult>> {
    return this.apollo.query({
      query: GET_CLIENT_PRESET,
    });
  }
}
