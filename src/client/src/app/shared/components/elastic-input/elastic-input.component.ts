import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-elastic-input',
  templateUrl: './elastic-input.component.html',
  styleUrls: ['./elastic-input.component.scss'],
})
export class ElasticInputComponent {
  @Input() public readonly placeholder = '';
  @Input() public readonly extendClass = '';
  @Input() public readonly maxCharacterLength = 0;
  @Output() public readonly inputChange = new EventEmitter<Event>();

  public isCounterVisible = false;

  public constructor(@Inject(DOCUMENT) public readonly document: Document) {}

  public handleFocus(): void {
    this.isCounterVisible = true;
  }

  public handleBlur(): void {
    this.isCounterVisible = false;
  }
}
