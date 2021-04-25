import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_LINKARD} from '~app/graphql/linkard/linkard.mutations';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';
import {LinkardCreateData} from '~app/types/linkard/linkard.interfaces';
import {GET_LINKARDS_BY_USERNAME} from '~app/graphql/linkard/linkard.queries';

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

  public getAllByUsername(username: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: GET_LINKARDS_BY_USERNAME,
      variables: {username},
    });
  }
}
