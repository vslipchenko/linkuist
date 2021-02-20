import {Component, Inject, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '@@types/dialog/dialog.interfaces';

// import {DialogTypes} from '@@types/dialog/dialog.enums';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: DialogData) {}

  // get dialogType(): DialogTypes {
  //   return this.data.dialogType;
  // }

  // get dialogTypes(): typeof DialogTypes {
  //   return DialogTypes;
  // }

  // get confirmTypeTitle(): string {
  //   return this.data?.dialogTitle ?? 'Confirmation';
  // }

  get title(): string {
    return this.data?.title;
  }

  get contentTemplateRef(): TemplateRef<unknown> {
    return this.data?.contentTemplateRef;
  }

  get actionsTemplateRef(): TemplateRef<unknown> {
    return this.data?.actionsTemplateRef;
  }
}
