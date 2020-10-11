import {NgModule} from '@angular/core';
import {Router, RouterModule, ROUTES, Routes} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {CommonModule} from "@angular/common";
import {extractUsername} from "../../utilities/url/url.utilities";
import {has as _has} from 'lodash';

function userRoutingHandler(authenticationService: AuthenticationService, router: Router): Routes | void {
  const routes: Routes = [];
  let username = extractUsername(window.location.pathname);

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
      routes.push({path: '', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)});
      return routes;
    }
  }
  debugger;
  routes.push({path: '', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)});
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
