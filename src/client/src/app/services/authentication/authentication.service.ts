import {Injectable} from '@angular/core';
import {UserSignInData} from "../../models/user";
import {Apollo} from "apollo-angular";
import {ACCESS_TOKEN_BY_REFRESH_TOKEN, SIGN_IN} from "../../graphql/authentication/authentication.queries";
import {Observable} from "rxjs";
import {ApolloError, ApolloQueryResult} from "@apollo/client/core";
import {AccessTokenData, AccessTokenQueryResult, JwtTokens, SignInQueryResult} from "../../models/authentication";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // accessToken
  private token: string;

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

  set accessToken(accessToken: string) {
    this.token = accessToken;
  }

  set tokens({accessToken, refreshToken}: JwtTokens) {
    this.token = accessToken;
    localStorage.setItem('token', refreshToken);
  }

  get accessToken(): string | undefined {
    return this.token;
  }

  get refreshToken(): string | null {
    return localStorage.getItem('token');
  }
  // Only access token's data can be trusted and verified
  get isValidAccessToken(): boolean {
    if (!this.accessToken) {
      return false;
    }

    const payload = jwt_decode(this.accessToken);
    const currentTimeMs = Date.now();
    const expirationTimeMs = payload.exp * 1000;
    const isExpired = currentTimeMs >= expirationTimeMs;

    return !isExpired;
  }

  get accessTokenData(): AccessTokenData | null {
    try {
      return jwt_decode(this.accessToken);
    } catch {
      return null;
    }
  }
}
