import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_LINKARD} from '@graphql/linkard/linkard.mutations';
import {Observable} from 'rxjs';
import {FetchResult} from '@apollo/client/core';
import {RecordId} from '@typings/graphql/graphql.interfaces';
import {LinkardCreateData} from '@typings/linkard/linkard.interfaces';

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
