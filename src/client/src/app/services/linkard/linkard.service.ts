import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_LINKARD} from '~app/graphql/linkard/linkard.mutations';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';
import {
  LinkardCreatePayload,
  LinkardsByUserIdQueryResult,
} from '~app/types/linkard/linkard.interfaces';
import {GET_LINKARDS_BY_USER_ID} from '~app/graphql/linkard/linkard.queries';

@Injectable({
  providedIn: 'root',
})
export class LinkardService {
  public constructor(private readonly apollo: Apollo) {}

  public create(input: LinkardCreatePayload): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_LINKARD,
      variables: {input},
    });
  }

  public getAllByUserId(
    userId: string,
  ): Observable<ApolloQueryResult<LinkardsByUserIdQueryResult>> {
    return this.apollo.query({
      query: GET_LINKARDS_BY_USER_ID,
      variables: {userId},
    });
  }

  // public getAllByUsername(
  //   username: string,
  // ): Observable<ApolloQueryResult<LinkardsByUsernameQueryResult>> {
  //   return this.apollo.query({
  //     query: GET_LINKARDS_BY_USERNAME,
  //     variables: {username},
  //   });
  // }
}
