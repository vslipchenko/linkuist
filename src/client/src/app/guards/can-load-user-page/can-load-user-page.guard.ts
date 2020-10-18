import {Injectable} from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CanLoadUserPageGuard implements CanLoad {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  canLoad(): Observable<boolean> | boolean {
    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;
    // user signed in & has refresh token & no access token
    if (refreshToken && !accessToken) {
      return this.authenticationService.refreshAccessToken().pipe(
        map(({data: {accessTokenByRefreshToken}}) => {
          this.authenticationService.accessToken = accessTokenByRefreshToken;
          return true;
        }),
        catchError(() => { // non-auth error occurred
          // TODO improve UI's app state reflectivness
          return of(false);
        })
      );
    }
    // guest
    return true;
  }
}
