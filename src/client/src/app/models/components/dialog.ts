import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../shared/components/dialog/dialog.component';
import {Observable} from 'rxjs';

export type DialogType = 'confirmation';

export enum DialogTypes {
  CONFIRMATION = 'confirmation'
}

export interface Dialog {
  dialogRef: MatDialogRef<DialogComponent>;
  dialogAfterClosed$: Observable<unknown>;
}

export interface DialogConfig {
  type: DialogType;
  config?: MatDialogConfig;
}

export interface DialogData {
  dialogType: DialogType;
  [key: string]: unknown;
}
