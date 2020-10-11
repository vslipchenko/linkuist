import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {userPageUrlMatcher} from "./utilities/url/url.utilities";
import {CanLoadUserPageGuard} from "./guards/can-load-user-page.guard";
// TODO 404 page
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./modules/sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./modules/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    matcher: userPageUrlMatcher,
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canLoad: [CanLoadUserPageGuard] // Pre-fetch data
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
