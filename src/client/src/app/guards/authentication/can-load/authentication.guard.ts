import {Injectable} from '@angular/core';
import {CanLoad} from '@angular/router';
import {AuthenticationService} from '@services/authentication/authentication.service';
import {extractUsername} from '@utilities/url';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationCanLoadGuard implements CanLoad {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  public canLoad(): boolean {
    const data = this.authenticationService.accessTokenData;
    const username = extractUsername(window.location.pathname);
    return data?.username === username;
  }
}
