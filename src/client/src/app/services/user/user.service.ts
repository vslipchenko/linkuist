import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {CREATE_USER_MUTATION} from "../../graphql/user/user.mutations";
import {UserSignUpData} from "../../models/user.model";
import {Observable} from "rxjs";
import {FetchResult} from "@apollo/client/core";
import {RecordId} from "../../models/graphql.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  create({email, username, password}: UserSignUpData): Observable<FetchResult<RecordId>> {
    return this.apollo.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: {input: {email, username, password}}
    });
  }
}
