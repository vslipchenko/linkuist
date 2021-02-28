import {Component, Inject, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '@@types/dialog/dialog.interfaces';

// import {DialogTypes} from '@@types/dialog/dialog.enums';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) private readonly data: DialogData) {}

  // get dialogType(): DialogTypes {
  //   return this.data.dialogType;
  // }

  // get dialogTypes(): typeof DialogTypes {
  //   return DialogTypes;
  // }

  // get confirmTypeTitle(): string {
  //   return this.data?.dialogTitle ?? 'Confirmation';
  // }

  public get title(): string | undefined {
    return this.data?.title;
  }

  public get contentTemplateRef(): TemplateRef<unknown> | undefined {
    return this.data?.contentTemplateRef;
  }

  public get actionsTemplateRef(): TemplateRef<unknown> | undefined {
    return this.data?.actionsTemplateRef;
  }
}
