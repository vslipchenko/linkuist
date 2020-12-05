import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '@shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    CommonModule,
    MatIconModule,
    TranslateModule,
    SharedModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class HomeModule {
}
