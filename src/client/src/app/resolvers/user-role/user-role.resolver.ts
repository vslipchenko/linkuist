import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserRole} from '~app/types/role/user-role.enums';

@Injectable({
  providedIn: 'root',
})
export class UserRoleResolver implements Resolve<UserRole> {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  public resolve(route: ActivatedRouteSnapshot): UserRole {
    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;

    // TODO move to url.ts utilities once stable
    const username = route.url[0].path.slice(1);

    if (accessToken && refreshToken) {
      const data = this.authenticationService.accessTokenData;

      if (data?.username === username) {
        return UserRole.Owner;
      }
    }

    return UserRole.Viewer;
  }
}
