import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {WrapIfDirective} from './directives/wrap-if/wrap-if.directive';
import {MatTooltipModule} from "@angular/material/tooltip";
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [NavigationComponent, WrapIfDirective, ProgressBarComponent],
  exports: [
    NavigationComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatProgressBarModule
  ]
})
export class SharedModule {
}
