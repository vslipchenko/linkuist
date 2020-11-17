import {Component, Input, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ControlContainer, ControlValueAccessor, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ChipsComponent implements ControlValueAccessor {

  @Input() formControlName: string;

  chips = {
    items: [
      {text: 'mine', isRemovable: true, isSelectable: true, onRemove: () => {}},
      'text',
      'tags'
    ],
    itemsAreSelectable: true,
    itemsAreRemovable: true,
    itemSeparatorKeyCodes: [ENTER, COMMA],
    input: {
      onItemAdd: (event) => {}
    },
    onRemove: () => {}
  };

  constructor() { }

  // ngOnInit(): void {
  // }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  selected(event) {

  }
}
