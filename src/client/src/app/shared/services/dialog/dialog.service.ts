import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '@shared/components/dialog/dialog.component';
import {Dialog, DialogConfig, DialogData} from '@models/components/dialog';
import {finalize} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogRef: MatDialogRef<DialogComponent>;

  constructor(private dialog: MatDialog) { }

  open(dialogConfig: DialogConfig): Dialog {
    this.dialogRef = this.dialog.open(DialogComponent, {
      ...dialogConfig.config,
      panelClass: dialogConfig.config?.panelClass // set default custom class
        ? ['dialog'].concat(dialogConfig.config.panelClass)
        : 'dialog',
      data: {
        ...dialogConfig.data,
        dialogType: dialogConfig.type,
        dialogTitle: dialogConfig.title,
        dialogContentTemplateRef: dialogConfig.contentTemplateRef
      } as DialogData
    });

    const dialogAfterClosed$ = this.dialogRef.afterClosed()
      .pipe(finalize(() => this.dialogRef = null));

    return {
      dialogRef: this.dialogRef,
      dialogAfterClosed$
    };
  }
}
