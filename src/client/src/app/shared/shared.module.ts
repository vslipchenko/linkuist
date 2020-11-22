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
import { DialogComponent } from './components/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ChipsComponent } from './components/chips/chips.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [NavigationComponent, WrapIfDirective, ProgressBarComponent, PageNotFoundComponent, DialogComponent, ChipsComponent],
  exports: [
    NavigationComponent,
    ProgressBarComponent,
    ChipsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule {
}
