// import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '@shared/components/dialog/dialog.component';
import {Observable} from 'rxjs';
import {TemplateRef} from '@angular/core';

// import {DialogTypes} from '@@types/dialog/dialog.enums';

export interface Dialog {
  dialogRef: MatDialogRef<DialogComponent>;
  dialogAfterClosed$: Observable<unknown>;
}

// export interface DialogConfig extends MatDialogConfig {
//   // type: DialogTypes;
//   // title?: string;
//   // contentTemplateRef?: TemplateRef<unknown>;
//   data: DialogData;
//   // config?: MatDialogConfig;
//   // [P in keyof MatDialogConfig]: MatDialogConfig[P];
// }

export interface DialogData {
  // dialogType: DialogTypes;
  title: string;
  contentTemplateRef: TemplateRef<unknown>;
  actionsTemplateRef: TemplateRef<unknown>;
  [key: string]: unknown;
}
