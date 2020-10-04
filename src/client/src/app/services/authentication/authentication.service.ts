import {Injectable} from '@angular/core';
import {UserSignInData} from "../../models/user";
import {Apollo} from "apollo-angular";
import {SIGN_IN} from "../../graphql/authentication/authentication.queries";
import {Observable} from "rxjs";
import {ApolloQueryResult} from "@apollo/client/core";
import {JwtTokens} from "../../models/authentication";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private apollo: Apollo) {
  }

  signIn(input: UserSignInData): Observable<ApolloQueryResult<JwtTokens>> {
    return this.apollo.query({
      query: SIGN_IN,
      variables: {input}
    });
  }
}
