import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    RouterModule.forChild([{path: '', component: UserProfileComponent}]),
    CommonModule,
    SharedModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class UserProfileModule {}
