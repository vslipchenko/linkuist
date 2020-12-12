import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {CREATE_USER} from '@graphql/user/user.mutations';
import {UserIdByEmail, UserIdByUsername, UserSignUpData} from '@app-types/user';
import {Observable} from "rxjs";
import {ApolloQueryResult, FetchResult} from "@apollo/client/core";
import {RecordId} from '@app-types/graphql';
import {USER_ID_BY_EMAIL, USER_ID_BY_USERNAME} from '@graphql/user/user.queries';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  create({email, username, password}: UserSignUpData): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {input: {email, username, password}}
    });
  }

  getIdByEmail(email: string): Observable<ApolloQueryResult<UserIdByEmail>> {
    return this.apollo.query({
      query: USER_ID_BY_EMAIL,
      variables: {email}
    });
  }

  getIdByUsername(username: string): Observable<ApolloQueryResult<UserIdByUsername>> {
    return this.apollo.query({
      query: USER_ID_BY_USERNAME,
      variables: {username}
    });
  }
}
