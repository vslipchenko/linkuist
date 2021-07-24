import {Inject, Injectable} from '@angular/core';
import {UserSignInPayload} from '~app/types/user/user.interfaces';
import {Apollo} from 'apollo-angular';
import {
  ACCESS_TOKEN_BY_REFRESH_TOKEN,
  SIGN_IN,
} from '~app/graphql/authentication/authentication.queries';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {
  AccessTokenData,
  AccessTokenQueryResult,
  JwtTokens,
  SignInQueryResult,
} from '~app/types/authentication/authentication.interfaces';
import jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';
import {LOCAL_STORAGE} from '~app/tokens/local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // accessToken
  private readonly token$ = new BehaviorSubject('');
  // isRefreshingAccessToken
  private readonly isRefreshing$ = new BehaviorSubject(false);

  public constructor(
    private readonly apollo: Apollo,
    private readonly router: Router,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
  ) {}

  public refreshAccessToken(): Observable<ApolloQueryResult<AccessTokenQueryResult>> {
    return this.refreshToken
      ? this.apollo.query({
          query: ACCESS_TOKEN_BY_REFRESH_TOKEN,
          variables: {refreshToken: this.refreshToken},
        })
      : throwError('REFRESH_TOKEN_EMPTY');
  }

  public signIn(input: UserSignInPayload): Observable<ApolloQueryResult<SignInQueryResult>> {
    return this.apollo.query({
      query: SIGN_IN,
      variables: {input},
    });
  }

  public signOut(): void {
    this.resetTokens();
    void this.router.navigate(['/sign-in']);
  }

  public resetTokens(): void {
    this.accessToken = '';
    this.refreshToken = '';
  }

  public set tokens({accessToken, refreshToken}: JwtTokens) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public set accessToken(accessToken: string) {
    this.token$.next(accessToken);
  }

  public get accessToken(): string {
    return this.token$.getValue();
  }

  public get accessTokenData(): AccessTokenData | null {
    try {
      return jwt_decode(this.accessToken);
    } catch {
      // ignore error
      return null;
    }
  }

  // public get accessToken$(): Observable<string> {
  //   return this.token$.asObservable();
  // }

  // private get accessTokenData$(): Observable<AccessTokenData | null> {
  //   return this.accessToken$.pipe(
  //     map((accessToken) => {
  //       try {
  //         return jwt_decode(accessToken);
  //       } catch {
  //         // ignore error
  //         return null;
  //       }
  //     }),
  //   );
  // }

  public set isRefreshingAccessToken(isRefreshing: boolean) {
    this.isRefreshing$.next(isRefreshing);
  }
  public get isRefreshingAccessToken(): boolean {
    return this.isRefreshing$.getValue();
  }

  // private get isRefreshingAccessToken$(): Observable<boolean> {
  //   return this.isRefreshing$.asObservable();
  // }

  public get refreshToken(): string {
    return this.localStorage.getItem('token') || '';
  }

  public set refreshToken(refreshToken: string) {
    if (!refreshToken) {
      this.localStorage.removeItem('token');
      return;
    }

    this.localStorage.setItem('token', refreshToken);
  }

  public get isUserAuthenticated(): boolean {
    return Boolean(this.accessToken && this.refreshToken);
  }
}
