import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {multiUrlMatcher, urlMatcher} from '~app/utilities/url';
import {PageNotFoundComponent} from '~app/shared/components/page-not-found/page-not-found.component';
import {URL_USERNAME_REGEXP} from '~app/constants/regexps';
import {HomeModule} from '~app/modules/home/home.module';
import {SignInModule} from '~app/modules/sign-in/sign-in.module';
import {SignUpModule} from '~app/modules/sign-up/sign-up.module';
import {ProfileModule} from '~app/modules/profile/profile.module';
import {LinkardsModule} from '~app/modules/linkards/linkards.module';
import {UserResolver} from '~app/resolvers/user/user.resolver';
import {UserCanActivateGuard} from '~app/guards/user/can-activate/user.guard';
import {UserCanLoadGuard} from '~app/guards/user/can-load/user.guard';

const routes: Routes = [
  {
    matcher: multiUrlMatcher([
      // match any of list items
      [URL_USERNAME_REGEXP],
      [URL_USERNAME_REGEXP, 'settings', 'profile'],
    ]),
    resolve: {
      resolved: UserResolver,
    },
    canActivate: [UserCanActivateGuard],
    canLoad: [UserCanLoadGuard],
    loadChildren: (): Promise<string | typeof ProfileModule> =>
      import('~app/modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP, 'linkards']),
    resolve: {
      resolved: UserResolver,
    },
    canActivate: [UserCanActivateGuard],
    canLoad: [UserCanLoadGuard],
    loadChildren: (): Promise<string | typeof LinkardsModule> =>
      import('~app/modules/linkards/linkards.module').then((m) => m.LinkardsModule),
  },
  {
    path: 'sign-in',
    loadChildren: (): Promise<string | typeof SignInModule> =>
      import('~app/modules/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'sign-up',
    loadChildren: (): Promise<string | typeof SignUpModule> =>
      import('~app/modules/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: '',
    loadChildren: (): Promise<string | typeof HomeModule> =>
      import('~app/modules/home/home.module').then((m) => m.HomeModule),
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
