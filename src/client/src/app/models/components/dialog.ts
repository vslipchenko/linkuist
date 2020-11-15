import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../shared/components/dialog/dialog.component';
import {Observable} from 'rxjs';
import {TemplateRef} from '@angular/core';

export enum DialogTypes {
  ADD = 'add',
  CONFIRM = 'confirm'
}

export interface Dialog {
  dialogRef: MatDialogRef<DialogComponent>;
  dialogAfterClosed$: Observable<unknown>;
}

export interface DialogConfig {
  type: DialogTypes;
  title?: string;
  contentTemplateRef?: TemplateRef<unknown>;
  data?: {[key: string]: unknown};
  config?: MatDialogConfig;
}

export interface DialogData {
  dialogType: DialogTypes;
  dialogTitle?: string;
  dialogContentTemplateRef?: TemplateRef<unknown>;
  [key: string]: unknown;
}
