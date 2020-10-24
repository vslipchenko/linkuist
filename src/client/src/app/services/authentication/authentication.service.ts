import {Injectable} from '@angular/core';
import {UserSignInData} from "../../models/user";
import {Apollo} from "apollo-angular";
import {ACCESS_TOKEN_BY_REFRESH_TOKEN, SIGN_IN} from "../../graphql/authentication/authentication.queries";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {ApolloQueryResult} from "@apollo/client/core";
import {AccessTokenData, AccessTokenQueryResult, JwtTokens, SignInQueryResult} from "../../models/authentication";
import jwt_decode from 'jwt-decode';
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // accessToken
  private readonly token$ = new BehaviorSubject('');
  // isRefreshingAccessToken
  private readonly isRefreshing$ = new BehaviorSubject(false);

  constructor(private apollo: Apollo,
              private router: Router) {
  }

  signIn(input: UserSignInData): Observable<ApolloQueryResult<SignInQueryResult>> {
    return this.apollo.query({
      query: SIGN_IN,
      variables: {input}
    });
  }

  refreshAccessToken(): Observable<ApolloQueryResult<AccessTokenQueryResult>> {
    return this.refreshToken
      ? this.apollo.query({
        query: ACCESS_TOKEN_BY_REFRESH_TOKEN,
        variables: {refreshToken: this.refreshToken}
      })
      : throwError('REFRESH_TOKEN_EMPTY');
  }

  logOut(): void {
    this.resetTokens();
    this.router.navigate(['/sign-in']);
  }

  private resetTokens(): void {
    this.accessToken = '';
    this.refreshToken = '';
  }

  set tokens({accessToken, refreshToken}: JwtTokens) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  set accessToken(accessToken: string) {
    this.token$.next(accessToken);
  }

  set isRefreshingAccessToken(isRefreshing) {
    this.isRefreshing$.next(isRefreshing);
  }

  private get accessTokenData$(): Observable<AccessTokenData | null> {
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

  private get isRefreshingAccessToken$(): Observable<boolean> {
    return this.isRefreshing$.asObservable();
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

  get refreshToken(): string {
    return localStorage.getItem('token') || '';
  }

  set refreshToken(refreshToken) {
    if (!refreshToken) {
      localStorage.removeItem('token');
    }
    localStorage.setItem('token', refreshToken);
  }

  get isRefreshingAccessToken(): boolean {
    return this.isRefreshing$.getValue();
  }
}
