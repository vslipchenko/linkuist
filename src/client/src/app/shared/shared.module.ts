import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from '~app/shared/components/navigation/navigation.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {WrapIfDirective} from '~app/shared/directives/wrap-if/wrap-if.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {PageNotFoundComponent} from '~app/shared/components/page-not-found/page-not-found.component';
import {MatButtonModule} from '@angular/material/button';
import {DialogComponent} from '~app/shared/components/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ChipsComponent} from '~app/shared/components/chips/chips.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LinkardComponent} from './components/linkard/linkard.component';
import {MatMenuModule} from '@angular/material/menu';
import {LengthCircleComponent} from './components/length-circle/length-circle.component';

@NgModule({
  declarations: [
    NavigationComponent,
    WrapIfDirective,
    ProgressBarComponent,
    PageNotFoundComponent,
    DialogComponent,
    ChipsComponent,
    LinkardComponent,
    LengthCircleComponent,
  ],
  exports: [
    NavigationComponent,
    ProgressBarComponent,
    ChipsComponent,
    LinkardComponent,
    WrapIfDirective,
    LengthCircleComponent,
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
    MatProgressSpinnerModule,
    MatMenuModule,
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: translateLoaderFactory('shared'),
    //     deps: [HttpClient],
    //   },
    //   isolate: true,
    // }),
  ],
})
export class SharedModule {
  // public constructor(translateService: TranslateService) {
  //   setupTranslate(translateService);
  // }
}
