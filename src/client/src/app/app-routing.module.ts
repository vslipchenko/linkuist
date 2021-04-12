import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {urlMatcher} from '~app/utilities/url';
import {PageNotFoundComponent} from '~app/shared/components/page-not-found/page-not-found.component';
import {URL_USERNAME_REGEXP} from '~app/constants/regexps';
import {HomeModule} from '~app/modules/home/home.module';
import {SignInModule} from '~app/modules/sign-in/sign-in.module';
import {SignUpModule} from '~app/modules/sign-up/sign-up.module';
import {UserModule} from '~app/modules/user/user.module';
import {LinkardsModule} from '~app/modules/user/linkards/linkards.module';
import {UserRoleResolver} from '~app/resolvers/user-role/user-role.resolver';

const routes: Routes = [
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP]),
    resolve: {
      userRole: UserRoleResolver,
    },
    loadChildren: (): Promise<string | typeof UserModule> =>
      import('~app/modules/user/user.module').then((m) => m.UserModule),
  },
  {
    matcher: urlMatcher([URL_USERNAME_REGEXP, 'linkards']),
    resolve: {
      userRole: UserRoleResolver,
    },
    // canActivate: [AuthenticationCanActivateGuard],
    // canLoad: [AuthenticationCanLoadGuard],
    loadChildren: (): Promise<string | typeof LinkardsModule> =>
      import('~app/modules/user/linkards/linkards.module').then((m) => m.LinkardsModule),
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
