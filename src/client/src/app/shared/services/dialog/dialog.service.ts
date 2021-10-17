import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '~app/shared/components/dialog/dialog.component';
import {MatDialogConfig} from '@angular/material/dialog/dialog-config';
import {DialogConfig} from '~app/shared/types/dialog/dialog.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  // private dialogRef: MatDialogRef<DialogComponent> | null | undefined;

  public constructor(private readonly dialog: MatDialog) {}

  public open(dialogConfig: MatDialogConfig<DialogConfig>): MatDialogRef<DialogComponent> {
    const {panelClass} = dialogConfig;

    return this.dialog.open<DialogComponent>(DialogComponent, {
      ...dialogConfig,
      panelClass: panelClass // set default custom class
        ? ['dialog'].concat(panelClass)
        : 'dialog',
      // data: dialogConfig.data
    });

    // const dialogAfterClosed$ = diadlogRef.afterClosed();

    // if (data?.statusChanges$) {
    //   data?.statusChanges$.subscribe((status) => {
    //     if (status === 'INVALID') {
    //     }
    //   });
    // }

    // this.dialogRef.disableClose
    // TODO Drop candidate
    // return {
    //   dialogRef: diadlogRef,
    //   dialogAfterClosed$,
    // };
  }

  // public close(): void {
  //   this.dialogRef?.close();
  // }
}
