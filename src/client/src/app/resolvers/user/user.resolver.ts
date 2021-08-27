import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserRole} from '~app/types/user/user.enums';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {ResolvedUserService} from '~app/services/resolved-user/resolved-user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<ResolvedUser> {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly resolvedUserService: ResolvedUserService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): ResolvedUser {
    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;

    // TODO move to url.ts utilities once stable
    const username = route.url[0].path.slice(1);
    const resolvedUser = {
      urlUsername: username,
      //relativePaths: route.url.slice(1).map((segment) => segment.path), // Drop urlUsername path
    } as ResolvedUser; // Paths have to be extracted from the router events only!!!

    this.resolvedUserService.user.urlUsername = username;

    if (accessToken && refreshToken) {
      const data = this.authenticationService.accessTokenData;

      if (data?.username === username) {
        resolvedUser.role = UserRole.USER;
        this.resolvedUserService.user.role = UserRole.USER;

        return resolvedUser;
      }

      resolvedUser.role = UserRole.VIEWER;
      this.resolvedUserService.user.role = UserRole.VIEWER;

      return resolvedUser;
    }

    resolvedUser.role = UserRole.GUEST;
    this.resolvedUserService.user.role = UserRole.GUEST;

    return resolvedUser;
  }
}
