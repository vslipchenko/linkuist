import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-number-cutter',
  template: '{{formattedValue}}',
})
export class NumberCutterComponent implements OnInit {
  @Input() public readonly value: number = 0;

  public formattedValue = '';

  private static insertCommaAtPosition(value: string, position: number): string {
    return value.replace(RegExp(`(?<=^.{${position}})`), ',');
  }

  // Up to 10 billion
  public ngOnInit(): void {
    switch (true) {
      case this.value < 1000:
        this.formattedValue = this.value.toString();
        return;
      case this.value < 10_000: {
        const slice = this.value.toString().slice(0, 2);
        const isFloat = slice[1] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 1)}k`
          : `${slice[0]}k`;
        return;
      }
      case this.value < 100_000: {
        const slice = this.value.toString().slice(0, 3);
        const isFloat = slice[2] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 2)}k`
          : `${slice.slice(0, -1)}k`;
        return;
      }
      case this.value < 1_000_000: {
        const slice = this.value.toString().slice(0, 4);
        const isFloat = slice[3] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 3)}k`
          : `${slice.slice(0, -1)}k`;
        return;
      }
      case this.value < 10_000_000: {
        const slice = this.value.toString().slice(0, 2);
        const isFloat = slice[1] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 1)}m`
          : `${slice.slice(0, -1)}m`;
        return;
      }
      case this.value < 100_000_000: {
        const slice = this.value.toString().slice(0, 3);
        const isFloat = slice[2] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 2)}m`
          : `${slice.slice(0, -1)}m`;
        return;
      }
      case this.value < 1_000_000_000: {
        const slice = this.value.toString().slice(0, 4);
        const isFloat = slice[3] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 3)}m`
          : `${slice.slice(0, -1)}m`;
        return;
      }
      case this.value < 10_000_000_000: {
        const slice = this.value.toString().slice(0, 2);
        const isFloat = slice[1] !== '0';

        this.formattedValue = isFloat
          ? `${NumberCutterComponent.insertCommaAtPosition(slice, 1)}b`
          : `${slice.slice(0, -1)}b`;
        return;
      }
      // case this.value < 100_000_000_000: {
      //   const slice = this.value.toString().slice(0, 3);
      //   const isFloat = slice[2] !== '0';
      //
      //   this.formattedValue = isFloat
      //     ? `${NumberCutterComponent.insertCommaAtPosition(slice, 2)}b`
      //     : `${slice.slice(0, -1)}b`;
      //   return;
      // }
    }
  }
}

/**
 999
 1k
 1,1k
 9,9k
 10k
 10,1k
 11k
 99,9k
 100k
 101k
 999,9k
 1m
 9,9m
 99,9m
 999,9m
 1b
 9,9b

 <pre>
   <app-number-cutter [value]="999"></app-number-cutter>
   <app-number-cutter [value]="1000"></app-number-cutter>
   <app-number-cutter [value]="1100"></app-number-cutter>
   <app-number-cutter [value]="9999"></app-number-cutter>
   <app-number-cutter [value]="10000"></app-number-cutter>
   <app-number-cutter [value]="10100"></app-number-cutter>
   <app-number-cutter [value]="11000"></app-number-cutter>
   <app-number-cutter [value]="99999"></app-number-cutter>
   <app-number-cutter [value]="100000"></app-number-cutter>
   <app-number-cutter [value]="101000"></app-number-cutter>
   <app-number-cutter [value]="999999"></app-number-cutter>
   <app-number-cutter [value]="1000000"></app-number-cutter>
   <app-number-cutter [value]="9999999"></app-number-cutter>
   <app-number-cutter [value]="99999999"></app-number-cutter>
   <app-number-cutter [value]="999999999"></app-number-cutter>
   <app-number-cutter [value]="1000000000"></app-number-cutter>
   <app-number-cutter [value]="9999999999"></app-number-cutter>
 </pre>
 */
