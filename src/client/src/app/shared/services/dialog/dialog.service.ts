import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '@shared/components/dialog/dialog.component';
import {Dialog, DialogData} from '@@types/dialog/dialog.interfaces';
import {finalize} from 'rxjs/operators';
import {MatDialogConfig} from '@angular/material/dialog/dialog-config';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: MatDialogRef<DialogComponent> | null | undefined;

  public constructor(private readonly dialog: MatDialog) {}

  public open(dialogConfig: MatDialogConfig<DialogData>): Dialog {
    this.dialogRef = this.dialog.open(DialogComponent, {
      ...dialogConfig,
      panelClass: dialogConfig?.panelClass // set default custom class
        ? ['dialog'].concat(dialogConfig.panelClass)
        : 'dialog',
      // data: dialogConfig.data
    });

    const dialogAfterClosed$ = this.dialogRef
      .afterClosed()
      .pipe(finalize(() => (this.dialogRef = null)));

    return {
      dialogRef: this.dialogRef,
      dialogAfterClosed$,
    };
  }
}
