import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountGuard} from "./guards/can-load/account/account.guard";
import {ProfileGuard} from "./guards/can-load/profile/profile.guard";
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
    path: '@:username', // REGEX goes here
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
    canLoad: [AccountGuard]
  },
  {
    path: '@:username',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    canLoad: [ProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
