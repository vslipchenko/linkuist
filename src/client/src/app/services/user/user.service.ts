import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_USER} from '~app/graphql/user/user.mutations';
import {
  UserIdByEmailQueryResult,
  UserIdByUsernameQueryResult,
  UserSignUpPayload,
} from '~app/types/user/user.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {RecordId} from '~app/types/graphql/graphql.interfaces';
import {USER_ID_BY_EMAIL, USER_ID_BY_USERNAME} from '~app/graphql/user/user.queries';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private readonly apollo: Apollo) {}

  public create({email, username, password}: UserSignUpPayload): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {input: {email, username, password}},
    });
  }

  public getIdByEmail(email: string): Observable<ApolloQueryResult<UserIdByEmailQueryResult>> {
    return this.apollo.query({
      query: USER_ID_BY_EMAIL,
      variables: {email},
    });
  }

  public getIdByUsername(
    username: string,
  ): Observable<ApolloQueryResult<UserIdByUsernameQueryResult>> {
    return this.apollo.query({
      query: USER_ID_BY_USERNAME,
      variables: {username},
    });
  }
}
