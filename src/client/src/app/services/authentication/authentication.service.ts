import {Injectable} from '@angular/core';
import {UserSignInData} from "../../models/user";
import {Apollo} from "apollo-angular";
import {ACCESS_TOKEN_BY_REFRESH_TOKEN, SIGN_IN} from "../../graphql/authentication/authentication.queries";
import {BehaviorSubject, Observable} from "rxjs";
import {ApolloQueryResult} from "@apollo/client/core";
import {AccessTokenData, AccessTokenQueryResult, JwtTokens, SignInQueryResult} from "../../models/authentication";
import jwt_decode from 'jwt-decode';
import gql from 'graphql-tag';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //accessToken
  private readonly token$ = new BehaviorSubject('');

  constructor(private apollo: Apollo) {
  }

  signIn(input: UserSignInData): Observable<ApolloQueryResult<SignInQueryResult>> {
    return this.apollo.query({
      query: SIGN_IN,
      variables: {input}
    });
  }

  recoverAccessToken(): Observable<ApolloQueryResult<AccessTokenQueryResult>> {
    return this.apollo.query({
      query: ACCESS_TOKEN_BY_REFRESH_TOKEN,
      variables: {refreshToken: this.refreshToken}
    });
  }

  mock() {
    return this.apollo.query({
      query: gql`
        query {
          testAuth
        }
      `
    });
  }

  resetTokens(): void {
    this.accessToken = '';
    localStorage.removeItem('token');
  }

  set tokens({accessToken, refreshToken}: JwtTokens) {
    this.accessToken = accessToken;
    localStorage.setItem('token', refreshToken);
  }

  set accessToken(accessToken: string) {
    this.token$.next(accessToken);
  }

  get accessToken(): string {
    return this.token$.getValue();
  }

  get accessToken$(): Observable<string> {
    return this.token$.asObservable();
  }

  get accessTokenData(): AccessTokenData | null {
    try {
      return jwt_decode(this.accessToken);
    } catch { // ignore error
      return null;
    }
  }

  get accessTokenData$(): Observable<AccessTokenData | null> {
    return this.accessToken$.pipe(
      map((accessToken) => {
        try {
          return jwt_decode(accessToken);
        } catch { // ignore error
          return null;
        }
      })
    );
  }

  get refreshToken(): string {
    return localStorage.getItem('token') || '';
  }
}
