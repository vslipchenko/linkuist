import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData, DialogType, DialogTypes} from '../../../models/components/dialog';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) private data: DialogData) {
  }

  ngOnInit(): void {
    // console.log(this.dialogTemplates);
  }

  get dialogType(): DialogType {
    return this.data.dialogType;
  }

  get dialogTypes(): typeof DialogTypes {
    return DialogTypes;
  }
}
