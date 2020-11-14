import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {extractUsername} from '../../../utilities/url/url.utilities';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCanActivateGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {
  }

  canActivate(): boolean {
    const data = this.authenticationService.accessTokenData;
    const username = extractUsername(window.location.pathname);
    debugger;
    return data?.username === username;
  }
}
