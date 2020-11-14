import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollectionsComponent} from './collections.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [CollectionsComponent],
  imports: [
    RouterModule.forChild([{path: '', component: CollectionsComponent}]),
    CommonModule
  ]
})
export class CollectionsModule {
}
