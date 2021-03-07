import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '@shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {translateLoaderFactory} from '@shared/factories/translate-loader';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    CommonModule,
    MatIconModule,
    SharedModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory('home'),
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
})
export class HomeModule {}
