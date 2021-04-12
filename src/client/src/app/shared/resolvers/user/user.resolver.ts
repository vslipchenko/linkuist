import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserRole} from '~app/types/user/user.enums';
import {ResolvedUser} from '~app/types/user/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<ResolvedUser> {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  public resolve(route: ActivatedRouteSnapshot): ResolvedUser {
    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;

    // TODO move to url.ts utilities once stable
    const username = route.url[0].path.slice(1);

    if (accessToken && refreshToken) {
      const data = this.authenticationService.accessTokenData;

      if (data?.username === username) {
        return {role: UserRole.Owner, urlUsername: username};
      }
    }

    return {role: UserRole.Viewer, urlUsername: username};
  }
}
