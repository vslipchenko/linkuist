import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {urlMatcher} from '@utilities/url';
import {PageNotFoundComponent} from '@shared/components/page-not-found/page-not-found.component';
import {AuthenticationCanActivateGuard} from '@guards/authentication/can-activate/authentication.guard';
import {AuthenticationCanLoadGuard} from '@guards/authentication/can-load/authentication.guard';
import {URL_USERNAME_REGEXP} from '@constants/regexps';
import {HomeModule} from '@modules/home/home.module';
import {SignInModule} from '@modules/sign-in/sign-in.module';
import {SignUpModule} from '@modules/sign-up/sign-up.module';
import {UserModule} from '@modules/user/user.module';
import {BookmarksModule} from '@modules/user/bookmarks/bookmarks.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: (): Promise<string | typeof HomeModule> =>
      import('@modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'sign-in',
    loadChildren: (): Promise<string | typeof SignInModule> =>
      import('@modules/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'sign-up',
    loadChildren: (): Promise<string | typeof SignUpModule> =>
      import('@modules/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP]),
    loadChildren: (): Promise<string | typeof UserModule> =>
      import('@modules/user/user.module').then((m) => m.UserModule),
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP, 'bookmarks']),
    canActivate: [AuthenticationCanActivateGuard],
    canLoad: [AuthenticationCanLoadGuard],
    loadChildren: (): Promise<string | typeof BookmarksModule> =>
      import('@modules/user/bookmarks/bookmarks.module').then((m) => m.BookmarksModule),
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
