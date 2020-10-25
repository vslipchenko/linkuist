import {NgModule} from '@angular/core';
import {Router, RouterModule, ROUTES, Routes} from '@angular/router';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {CommonModule} from '@angular/common';
import {extractUsername} from '../../utilities/url/url.utilities';
import {has as _has} from 'lodash';
import {CanActivateAccountPageGuard} from '../../guards/can-activate-account-page/can-activate-account-page.guard';

function userRoutingHandler(authenticationService: AuthenticationService, router: Router): Routes | void {
  const routes: Routes = [];
  let username = extractUsername(window.location.pathname);
  console.log('IN ROUTING MODULE');
  if (!username) {
    const currentNavigation = router.getCurrentNavigation();

    if (_has(currentNavigation, 'extractedUrl.root.children.primary.segments[0].path')) {
      username = extractUsername(currentNavigation.extractedUrl.root.children.primary.segments[0].path);
    } else { // cant retrieve username
      router.navigate(['/sign-in']);
      return;
    }
  }

  if (authenticationService.accessToken) {
    const data = authenticationService.accessTokenData;

    if (data.username === username) {
      routes.push({
        path: '',
        canActivate: [CanActivateAccountPageGuard],
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      });
      return routes;
    }
  }

  routes.push({
    path: '',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  });

  // const routeIndex = router.config.findIndex(route => route.matcher?.name === 'userPageUrlMatcher');
  // router.config.splice(routeIndex, 1, {
  //   matcher: userPageUrlMatcher,
  //   loadChildren: () => import('./user.module').then(m => m.UserModule),
  //   canLoad: [CanLoadUserPageGuard] // Pre-fetch data
  // });
  return routes;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [{
    provide: ROUTES,
    useFactory: userRoutingHandler,
    deps: [AuthenticationService, Router],
    multi: true
  }]
})
export class UserRoutingModule {
}
