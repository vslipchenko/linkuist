import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserService} from '~app/services/user/user.service';
import {map} from 'rxjs/operators';

// Can load only if user-profile exist
@Injectable({
  providedIn: 'root',
})
export class UserCanLoadGuard implements CanLoad {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  public canLoad(route: Route, segments: Array<UrlSegment>): Observable<boolean> | boolean {
    const data = this.authenticationService.accessTokenData;
    const username = segments[0].path.slice(1);

    if (data?.username === username) return true; // user-profile exist

    // check user-profile exist
    return this.userService.getIdByUsername(username).pipe(
      map(({data}) => {
        if (data.userByUsername?._id) return true; // user-profile exist
        // user-profile does not exist
        void this.router.navigate(['**'], {skipLocationChange: true});
        return false;
      }),
    );
  }
}
