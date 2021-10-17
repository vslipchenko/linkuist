import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinkardsComponent} from './linkards.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {StoreModule} from '@ng-estate/store';
import {LinkardsStore} from '~app/modules/linkards/store';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [LinkardsComponent],
  imports: [
    RouterModule.forChild([{path: '', component: LinkardsComponent}]),
    CommonModule,
    StoreModule.forChild(LinkardsStore),
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
})
export class LinkardsModule {}
