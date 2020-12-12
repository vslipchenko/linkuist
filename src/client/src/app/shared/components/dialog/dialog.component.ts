import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData, DialogTypes} from '@app-types/components/dialog';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) private data: DialogData) {
  }

  ngOnInit(): void {
  }

  get dialogType(): DialogTypes {
    return this.data.dialogType;
  }

  get dialogTypes(): typeof DialogTypes {
    return DialogTypes;
  }

  get confirmTypeTitle(): string {
    return this.data?.dialogTitle ?? 'Confirmation';
  }

  get addTypeTitle(): string {
    return this.data?.dialogTitle ?? 'Add';
  }

  get contentTemplateRef(): TemplateRef<unknown> {
    return this.data?.dialogContentTemplateRef;
  }
}
