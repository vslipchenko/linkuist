import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {WrapIfDirective} from './directives/wrap-if/wrap-if.directive';

@NgModule({
  declarations: [NavigationComponent, WrapIfDirective],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ]
})
export class SharedModule {
}
