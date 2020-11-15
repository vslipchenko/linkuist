import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionsComponent} from './collections.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [CollectionsComponent],
  imports: [
    RouterModule.forChild([{path: '', component: CollectionsComponent}]),
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class CollectionsModule {
}
