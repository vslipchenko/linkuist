import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {AccountModule} from './account/account.module';
import {ProfileModule} from './profile/profile.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [UserComponent],
  imports: [
    RouterModule.forChild([{path: '', component: UserComponent}]),
    CommonModule,
    AccountModule,
    ProfileModule
  ]
})
export class UserModule {
}
