import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [AccountComponent],
  exports: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AccountModule {
}
