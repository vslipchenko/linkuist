import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CREATE_USER} from '@graphql/user/user.mutations';
import {UserIdByEmail, UserIdByUsername, UserSignUpData} from '@@types/user/user.interfaces';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {RecordId} from '@@types/graphql/graphql.interfaces';
import {USER_ID_BY_EMAIL, USER_ID_BY_USERNAME} from '@graphql/user/user.queries';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private readonly apollo: Apollo) {}

  public create({email, username, password}: UserSignUpData): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {input: {email, username, password}},
    });
  }

  public getIdByEmail(email: string): Observable<ApolloQueryResult<UserIdByEmail>> {
    return this.apollo.query({
      query: USER_ID_BY_EMAIL,
      variables: {email},
    });
  }

  public getIdByUsername(username: string): Observable<ApolloQueryResult<UserIdByUsername>> {
    return this.apollo.query({
      query: USER_ID_BY_USERNAME,
      variables: {username},
    });
  }
}
