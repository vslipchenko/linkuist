import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {PostsComponent} from './posts/posts.component';

@NgModule({
  declarations: [ProfileComponent, PostsComponent],
  imports: [
    RouterModule.forChild([{path: '', component: ProfileComponent}]),
    CommonModule,
    SharedModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class ProfileModule {}
