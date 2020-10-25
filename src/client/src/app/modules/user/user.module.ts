import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {AccountModule} from './account/account.module';
import {ProfileModule} from './profile/profile.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    AccountModule,
    ProfileModule
  ]
})
export class UserModule {
}
