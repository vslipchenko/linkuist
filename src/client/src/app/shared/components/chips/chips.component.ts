import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {MatChipEvent} from '@angular/material/chips/chip';
import {MatChipInputEvent} from '@angular/material/chips/chip-input';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete/autocomplete';
import {Observable} from 'rxjs';
import {first, startWith} from 'rxjs/operators';
import {has as _has} from 'lodash';
import {UntilDestroy, untilDestroyed} from '@utilities/until-destroy';

// TODO remove chip color directive logic once autocomplete issue fixed
@UntilDestroy()
@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  // viewProviders: [{
  //   provide: ControlContainer,
  //   useExisting: FormGroupDirective
  // }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChipsComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent implements OnInit, ControlValueAccessor {
  // General
  @Input() public formControlName: string | undefined;
  @Input() public formControl: FormControl | undefined;
  @Input() public label: string | undefined;
  // Formatting
  @Input() public chipsSeparatorKeyCodes: Array<number> | undefined;
  @Input() public chipSeparator: string | undefined;
  @Input() public chipLetterValidator: RegExp | undefined;
  @Input() public chipSplitWordBy: RegExp | undefined;
  // States
  @Input() public areChipsSelectable: boolean | undefined;
  @Input() public areChipsRemovable: boolean | undefined;
  @Input() public areChipsLowerCased: boolean | undefined;
  @Input() public isInputAvailable: boolean | undefined;
  @Input() public isAddOnBlurAvailable: boolean | undefined;
  // Autocomplete
  @Input() public autocompleteOptions$: (() => Observable<Array<unknown>>) | undefined;
  @Input() public autocompleteOptions: Array<unknown> | undefined;
  @Input() public cacheAutocompleteOptions: boolean | undefined;
  // Hints
  @Input() public leftHint: string | undefined;
  @Input() public rightHint: string | undefined;

  @ViewChild('chipInput') public inputElementRef: ElementRef<HTMLInputElement> | undefined;

  public areAutocompleteOptionsLoading: boolean | undefined;

  @Input() public onAutocompleteOptionSelect: (
    event: MatAutocompleteSelectedEvent,
  ) => unknown = () => {};

  public constructor(private readonly controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    // get control by name if not control itself passed
    if (!this.formControl && this.formControlName) {
      this.formControl = this.controlContainer.control?.get(this.formControlName) as FormControl;
    }
  }

  public writeValue(chips: Array<any> | undefined): void {
    // tune the most recent chip, assume other are valid
    chips = this.removeChipDuplicates(this.tuneRecentChip(chips));
    this.formControl?.setValue(chips, {emitModelToViewChange: false});
    this.resetChipInput();

    console.log(this.chips);
  }

  public registerOnChange(): void {}

  public registerOnTouched(): void {}

  public removeChip(event: MatChipEvent): void {
    const text = event.chip.value.trim();
    this.writeValue(
      this.chips?.filter((chip) =>
        // debugger;
        chip.text ? chip.text !== text : chip !== text,
      ),
    );
    // this.();
  }

  public appendChip(event: MatChipInputEvent): void {
    // this.updateChips(event.value);
    const updatedChips = this.chips?.concat(event.value);
    // this.formControl.setValue(updatedChips);
    this.writeValue(updatedChips);
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
  // }

  public serveAutocompleteOptions(): void {
    // if cache is ON
    // if (this.cacheAutocompleteOptions) {
    //   // if options not cached yet
    //   if (!this.autocompleteOptions?.length && this.autocompleteOptions$) {
    //
    //   } // stream autocomplete options; else serve static autocompleteOptions
    // } else if (this.autocompleteOptions$) {
    //
    // }

    if (this.autocompleteOptions$) {
      if (this.cacheAutocompleteOptions && !this.autocompleteOptions?.length) {
        this.areAutocompleteOptionsLoading = true;
        this.autocompleteOptions$()
          .pipe(first(), untilDestroyed(this))
          .subscribe((options) => {
            this.areAutocompleteOptionsLoading = false;
            this.autocompleteOptions = options;
          });
      } else {
        this.areAutocompleteOptionsLoading = true;
        this.autocompleteOptions$()
          .pipe(untilDestroyed(this))
          .subscribe((options) => {
            this.areAutocompleteOptionsLoading = false;
            this.autocompleteOptions = options;
          });
      }
    }
  }

  public getExactValueOrUseDefault(
    source: {[k: string]: any},
    property: string,
    defaultValue: unknown,
  ): unknown {
    if (_has(source, property)) {
      return source[property];
    } else {
      return defaultValue;
    }
  }

  private removeChipDuplicates(chips: Array<any> | undefined): Array<any> | undefined {
    return chips?.reduce((previousValue, currentValue) => {
      if (
        !previousValue.length ||
        !previousValue.find((chip: any) =>
          chip.text
            ? chip.text === currentValue || chip.text === currentValue.text
            : chip === currentValue || chip === currentValue.text,
        )
      ) {
        return previousValue.concat(currentValue);
      }
      return previousValue;
    }, []);
  }

  private tuneRecentChip(chips: Array<any> | undefined): Array<any> | undefined {
    if (this.chipLetterValidator && chips?.length) {
      const chip = chips.pop();
      // return chips.map(chip => {
      let chipText = chip.text || chip;
      let words = chipText.split(this.chipSplitWordBy).filter((word: string) => Boolean(word));
      // debugger;
      // debugger;
      words = words
        .map((word: string) => {
          const letters = [...word];
          // filter letters
          return letters
            .map((letter) => {
              if (this.chipLetterValidator?.test(letter)) {
                return this.areChipsLowerCased ? letter.toLowerCase() : letter;
              }
            })
            .join('');
        })
        .filter((word: string) => word.length);
      // remove separator duplicates
      chipText = words.join(this.chipSeparator);
      // debugger;
      // debugger;
      if (chipText) {
        return chips.concat(chip.text ? {...chip, text: chipText} : chipText);
      }
      // });
    }

    return chips;
  }

  private resetChipInput(): void {
    if (this.inputElementRef) {
      this.inputElementRef.nativeElement.value = '';
    }
  }

  public get chips(): Array<any> | undefined {
    return this.formControl?.value;
  }

  public get chips$(): Observable<Array<any>> | undefined {
    return this.formControl?.valueChanges?.pipe(startWith(this.chips));
  }
}
