import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {AuthenticationService} from "../services/authentication/authentication.service";
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

    if (refreshToken && !accessToken) {
      return this.authenticationService.recoverAccessToken().pipe(
        map(({data: {accessTokenByRefreshToken}}) => {
          this.authenticationService.accessToken = accessTokenByRefreshToken;

          return true;
        }),
        catchError(() => this.router.navigate(['/sign-in']))
      );
    }

    return true;
  }
}
