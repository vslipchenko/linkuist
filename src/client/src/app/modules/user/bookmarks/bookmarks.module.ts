import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookmarksComponent} from './bookmarks.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [BookmarksComponent],
  imports: [
    RouterModule.forChild([{path: '', component: BookmarksComponent}]),
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class BookmarksModule {
}
