import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '~app/shared/components/dialog/dialog.component';
import {Dialog, DialogConfig} from '~app/types/dialog/dialog.interfaces';
import {finalize} from 'rxjs/operators';
import {MatDialogConfig} from '@angular/material/dialog/dialog-config';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: MatDialogRef<DialogComponent> | null | undefined;

  public constructor(private readonly dialog: MatDialog) {}

  public open(dialogConfig: MatDialogConfig<DialogConfig>): Dialog {
    const {panelClass} = dialogConfig;

    this.dialogRef = this.dialog.open(DialogComponent, {
      ...dialogConfig,
      panelClass: panelClass // set default custom class
        ? ['dialog'].concat(panelClass)
        : 'dialog',
      // data: dialogConfig.data
    });

    const dialogAfterClosed$ = this.dialogRef
      .afterClosed()
      .pipe(finalize(() => (this.dialogRef = null)));

    // if (data?.statusChanges$) {
    //   data?.statusChanges$.subscribe((status) => {
    //     if (status === 'INVALID') {
    //     }
    //   });
    // }

    // this.dialogRef.disableClose
    // TODO Drop candidate
    return {
      dialogRef: this.dialogRef,
      dialogAfterClosed$,
    };
  }

  public close(): void {
    this.dialogRef?.close();
  }
}
