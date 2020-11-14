import {Injectable} from '@angular/core';
import {CanLoad} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {extractUsername} from '../../../utilities/url/url.utilities';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCanLoadGuard implements CanLoad {
  constructor(private authenticationService: AuthenticationService) {
  }

  canLoad(): boolean {
    const data = this.authenticationService.accessTokenData;
    const username = extractUsername(window.location.pathname);
    return data?.username === username;
  }
}
