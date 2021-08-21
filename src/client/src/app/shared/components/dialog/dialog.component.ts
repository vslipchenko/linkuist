import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogConfig} from '~app/shared/types/dialog/dialog.interfaces';

// import {DialogTypes} from '~app/types/dialog/dialog.enums';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) public readonly data: DialogConfig) {}

  // get dialogType(): DialogTypes {
  //   return this.data.dialogType;
  // }

  // get dialogTypes(): typeof DialogTypes {
  //   return DialogTypes;
  // }

  // get confirmTypeTitle(): string {
  //   return this.data?.dialogTitle ?? 'Confirmation';
  // }

  // public get title(): string | undefined {
  //   return this.data?.title;
  // }
  //
  // public get contentTemplateRef(): TemplateRef<unknown> | undefined {
  //   return this.data?.contentTemplateRef;
  // }
  //
  // public get actionsTemplateRef(): TemplateRef<unknown> | undefined {
  //   return this.data?.actionsTemplateRef;
  // }
}
