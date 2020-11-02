import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../components/dialog/dialog.component';
import {DialogConfig} from '../../../models/components/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogRef: MatDialogRef<DialogComponent>;

  constructor(private dialog: MatDialog) { }

  open(dialogConfig: DialogConfig): MatDialogRef<DialogComponent> {
    this.dialogRef = this.dialog.open(DialogComponent);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });

    return this.dialogRef;
  }
}
