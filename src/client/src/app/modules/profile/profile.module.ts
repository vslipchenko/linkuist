import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
// import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {setupTranslate, translateLoaderFactory} from '~app/utilities/translate';
import {HttpClient} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {StoreModule} from '@ng-estate/store';
import {ProfileStore} from '~app/modules/profile/store';
import {PostsModule} from '~app/modules/profile/modules/posts/posts.module';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    RouterModule.forChild([{path: '', component: ProfileComponent}]),
    CommonModule,
    StoreModule.forChild(ProfileStore),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory('profile'),
        deps: [HttpClient],
      },
      isolate: true,
    }),
    MatProgressSpinnerModule,
    MatInputModule,
    SharedModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatButtonModule,
    PostsModule,
    MatDialogModule,
  ],
})
export class ProfileModule {
  public constructor(translateService: TranslateService) {
    setupTranslate(translateService);
  }
}
