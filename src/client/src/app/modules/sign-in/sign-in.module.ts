import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignInComponent} from './sign-in.component';
import {SharedModule} from '@shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {translateLoaderFactory} from '@shared/factories/translate-loader';
import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    RouterModule.forChild([{path: '', component: SignInComponent}]),
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory('sign-in'),
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class SignInModule {}
