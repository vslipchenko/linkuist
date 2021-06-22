import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {map} from 'rxjs/operators';
import {UserService} from '~app/services/user/user.service';

// Can activate only if profile exist
@Injectable({
  providedIn: 'root',
})
export class UserCanActivateGuard implements CanActivate {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const data = this.authenticationService.accessTokenData;
    const username = route.url[0].path.slice(1);

    if (data?.username === username) return true; // profile exist

    // check profile exist
    return this.userService.getIdByUsername(username).pipe(
      map(({data}) => {
        if (data.userByUsername?._id) {
          return true;
        } // profile exist
        // profile does not exist
        void this.router.navigate(['**'], {skipLocationChange: true, state: {statusCode: 404}});
        return false;
      }),
    );
  }
}
