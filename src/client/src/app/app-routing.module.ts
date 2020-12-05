import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {urlMatcher} from '@utilities/url/url.utilities';
import {PageNotFoundComponent} from '@shared/components/page-not-found/page-not-found.component';
import {AuthenticationCanActivateGuard} from '@guards/authentication/can-activate/authentication.guard';
import {AuthenticationCanLoadGuard} from '@guards/authentication/can-load/authentication.guard';
import {URL_USERNAME_REGEXP} from '@constants/validation';
// TODO 404 page
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('@modules/sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('@modules/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP]),
    loadChildren: () => import('@modules/user/user.module').then(m => m.UserModule)
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP, 'bookmarks']),
    canActivate: [AuthenticationCanActivateGuard],
    canLoad: [AuthenticationCanLoadGuard],
    loadChildren: () => import('@modules/user/bookmarks/bookmarks.module').then(m => m.BookmarksModule)
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
