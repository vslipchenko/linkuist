import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {urlMatcher} from '~app/utilities/url';
import {PageNotFoundComponent} from '~app/shared/components/page-not-found/page-not-found.component';
import {URL_USERNAME_REGEXP} from '~app/constants/regexps';
import {HomeModule} from '~app/modules/home/home.module';
import {SignInModule} from '~app/modules/sign-in/sign-in.module';
import {SignUpModule} from '~app/modules/sign-up/sign-up.module';
import {UserProfileModule} from '~app/modules/user-profile/user-profile.module';
import {LinkardsModule} from '~app/modules/linkards/linkards.module';
import {UserResolver} from '~app/shared/resolvers/user/user.resolver';
import {UserCanActivateGuard} from '~app/guards/user/can-activate/user.guard';
import {UserCanLoadGuard} from '~app/guards/user/can-load/user.guard';

const routes: Routes = [
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP]),
    resolve: {
      user: UserResolver,
    },
    canActivate: [UserCanActivateGuard],
    canLoad: [UserCanLoadGuard],
    loadChildren: (): Promise<string | typeof UserProfileModule> =>
      import('~app/modules/user-profile/user-profile.module').then((m) => m.UserProfileModule),
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP, 'linkards']),
    resolve: {
      user: UserResolver,
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
