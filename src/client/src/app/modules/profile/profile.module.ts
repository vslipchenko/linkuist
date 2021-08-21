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
import {ReactiveFormsModule} from '@angular/forms';
// import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {setupTranslate, translateLoaderFactory} from '~app/utilities/translate';
import {HttpClient} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';

@NgModule({
  declarations: [ProfileComponent, PostsComponent, PostComponent, AddPostComponent],
  imports: [
    RouterModule.forChild([{path: '', component: ProfileComponent}]),
    CommonModule,
    SharedModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    // MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory('profile'),
        deps: [HttpClient],
      },
      isolate: true,
    }),
    MatProgressSpinnerModule,
  ],
})
export class ProfileModule {
  public constructor(translateService: TranslateService) {
    setupTranslate(translateService);
  }
}
