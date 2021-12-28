import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '~app/shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {PostsComponent} from '~app/modules/profile/modules/posts/posts.component';
import {PostComponent} from '~app/modules/profile/modules/posts/components/post/post.component';
import {AddPostComponent} from '~app/modules/profile/modules/posts/components/add-post/add-post.component';
import {StoreManager} from '@ng-estate/store';
import {PostsStore} from '~app/modules/profile/modules/posts/store';
import {PostCommentComponent} from './components/post-comment/post-comment.component';
import {AddCommentComponent} from './components/add-comment/add-comment.component';
import {PostSubcommentsComponent} from './components/post-subcomments/post-subcomments.component';

@NgModule({
  declarations: [
    PostsComponent,
    PostComponent,
    AddPostComponent,
    PostCommentComponent,
    AddCommentComponent,
    PostSubcommentsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    // StoreModule.forChild(PostsStore),
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [PostsComponent],
})
export class PostsModule {
  public constructor(storeManager: StoreManager) {
    storeManager.registerStore(PostsStore);
  }
}
