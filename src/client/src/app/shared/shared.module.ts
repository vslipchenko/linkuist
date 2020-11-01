import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {WrapIfDirective} from './directives/wrap-if/wrap-if.directive';
import {MatTooltipModule} from "@angular/material/tooltip";
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [NavigationComponent, WrapIfDirective, ProgressBarComponent, PageNotFoundComponent],
  exports: [
    NavigationComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule
  ]
})
export class SharedModule {
}
