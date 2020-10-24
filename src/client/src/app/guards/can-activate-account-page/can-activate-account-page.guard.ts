import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAccountPageGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;
    const canActivate = refreshToken && accessToken && typeof accessToken === 'string';
    // redirect to sign in page if user is trying to navigate back to profile without accessToken
    if (!canActivate) {
      this.router.navigate(['/sign-in']);
    }
    console.log('CAN ACTIVATE IS ', canActivate);
    return canActivate;
  }
}
