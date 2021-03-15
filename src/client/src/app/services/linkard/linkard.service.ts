import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_LINKARD} from '~app/graphql/linkard/linkard.mutations';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';
import {LinkardCreateData} from '~app/types/linkard/linkard.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LinkardService {
  public constructor(private readonly apollo: Apollo) {}

  public create({
    id,
    link,
    note,
    isPrivate,
    isPaid,
    tags,
  }: LinkardCreateData): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_LINKARD,
      variables: {input: {id, link, note, isPrivate, isPaid, tags}},
    });
  }
}
