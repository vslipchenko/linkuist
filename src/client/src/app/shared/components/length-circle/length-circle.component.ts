import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ThemePalette} from '@angular/material/core/common-behaviors/color';
// import {LengthCircleColorMap} from '~app/shared/types/length-circle/length-circle.types';

@Component({
  selector: 'app-length-circle',
  templateUrl: './length-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LengthCircleComponent implements OnChanges {
  @Input() public value = 0;
  @Input() public maxValue = 0;
  @Input() public diameter = 0;
  @Input() public color: ThemePalette = 'primary';
  // @Input() public colorMap: LengthCircleColorMap = {};
  @Input() public defineColor: ((value: number, percentValue?: number) => ThemePalette) | undefined;

  private percentValue = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value.currentValue) return;

    if (this.maxValue) this.percentValue = (this.value * 100) / this.maxValue;
    // console.log(this.percentValue);

    // if (!this.colorMap) return;
    if (!this.defineColor) return;

    // this.color = this.colorMap[this.maxValue ? this.percentValue : this.value] || this.color;
    this.color = this.maxValue
      ? this.defineColor(this.value, this.percentValue)
      : this.defineColor(this.value);
  }

  public get progressValue(): number {
    return this.maxValue ? this.percentValue : this.value;
  }
}
