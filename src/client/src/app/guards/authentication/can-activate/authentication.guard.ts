import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationService} from '@services/authentication/authentication.service';
import {extractUsername} from '@utilities/url';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationCanActivateGuard implements CanActivate {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  public canActivate(): boolean {
    const data = this.authenticationService.accessTokenData;
    const username = extractUsername(window.location.pathname);
    // TODO redirect not signed in visitor while navigating @username/bookmarks to the homepage
    return data?.username === username;
  }
}
