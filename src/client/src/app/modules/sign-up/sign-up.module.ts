import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignUpComponent} from './sign-up.component';
import {SharedModule} from '~app/shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {setupTranslate, translateLoaderFactory} from '~app/utilities/translate';
import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    RouterModule.forChild([{path: '', component: SignUpComponent}]),
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory('sign-up'),
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class SignUpModule {
  public constructor(translateService: TranslateService) {
    setupTranslate(translateService);
  }
}
