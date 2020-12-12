import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatChipEvent} from '@angular/material/chips/chip';
import {MatChipInputEvent} from '@angular/material/chips/chip-input';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete/autocomplete';
import {Observable} from 'rxjs';
import {first, startWith} from 'rxjs/operators';
import {has as _has} from 'lodash';

// TODO remove chip color directive logic once autocomplete issue fixed
@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  // viewProviders: [{
  //   provide: ControlContainer,
  //   useExisting: FormGroupDirective
  // }],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ChipsComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsComponent implements OnInit, ControlValueAccessor {
  // General
  @Input() formControlName: string;
  @Input() formControl: FormControl;
  @Input() label: string;
  // Formatting
  @Input() chipsSeparatorKeyCodes: Array<number>;
  @Input() chipSeparator: string;
  @Input() chipLetterValidator: RegExp;
  // States
  @Input() areChipsSelectable: boolean;
  @Input() areChipsRemovable: boolean;
  @Input() areChipsLowerCased: boolean;
  @Input() isInputAvailable: boolean;
  @Input() isAddOnBlurAvailable: boolean;
  // Autocomplete
  @Input() autocompleteOptions$: () => Observable<Array<unknown>>;
  @Input() autocompleteOptions: Array<unknown>;
  @Input() cacheAutocompleteOptions: boolean;
  @Input() onAutocompleteOptionSelect: (event: MatAutocompleteSelectedEvent) => unknown;
  // Hints
  @Input() leftHint: string;
  @Input() rightHint: string;

  @ViewChild('chipInput')
  inputElementRef: ElementRef<HTMLInputElement>;

  areAutocompleteOptionsLoading: boolean;

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit(): void {
    // get control by name if not control itself passed
    if (!this.formControl) {
      this.formControl = this.controlContainer.control.get(this.formControlName) as FormControl;
    }
  }

  writeValue(chips: Array<any>): void {
    // tune the most recent chip, assume other are valid
    chips = this.removeChipDuplicates(this.tuneRecentChip(chips));
    this.formControl.setValue(chips, {emitModelToViewChange: false});
    this.resetChipInput();

    console.log(this.chips);
  }

  registerOnChange(fn: unknown): void {
  }

  registerOnTouched(fn: unknown): void {
  }

  removeChip(event: MatChipEvent): void {
    const text = event.chip.value.trim();
    this.writeValue(this.chips.filter(
      chip => {
        // debugger;
        return chip.text ? chip.text !== text : chip !== text;
      }
    ));
    // this.();
  }

  appendChip(event: MatChipInputEvent): void {
    // this.updateChips(event.value);
    const updatedChips = this.chips.concat(event.value);
    // this.formControl.setValue(updatedChips);
    this.writeValue(updatedChips);
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
  // }

  serveAutocompleteOptions(): void {
    // if cache is ON
    if (this.cacheAutocompleteOptions) {
      // if options not cached yet
      if (!this.autocompleteOptions.length) {
        this.areAutocompleteOptionsLoading = true;
        this.autocompleteOptions$()
          .pipe(first())
          .subscribe((options) => {
            this.areAutocompleteOptionsLoading = false;
            this.autocompleteOptions = options;
          });
      } // stream autocomplete options; else serve static autocompleteOptions
    } else if (this.autocompleteOptions$) {
      this.areAutocompleteOptionsLoading = true;
      this.autocompleteOptions$()
        .subscribe((options) => {
          this.areAutocompleteOptionsLoading = false;
          this.autocompleteOptions = options;
        });
    }
  }

  getExactValueOrUseDefault(source: any, property: string, defaultValue: unknown): unknown {
    if (_has(source, property)) {
      return source[property];
    } else {
      return defaultValue;
    }
  }

  private removeChipDuplicates(chips: Array<any>): Array<any> {
    return chips.reduce(
      (previousValue, currentValue) => {
        if (!previousValue.length || !previousValue.find(chip => chip.text ? chip.text === currentValue || chip.text === currentValue.text : chip === currentValue || chip === currentValue.text)) {
          return previousValue.concat(currentValue);
        }
        return previousValue;
      },
      []
    );
  }

  private tuneRecentChip(chips: Array<any>): Array<any> {
    if (this.chipLetterValidator && chips.length) {
      const chip = chips.pop();
      // return chips.map(chip => {
      let chipText = chip.text || chip;
      let words = chipText.split(this.chipSeparator).filter(word => !!word);
      // debugger;
      words = words.map(word => {
        const letters = [...word];
        // filter letters
        return letters.map(letter => {
          if (this.chipLetterValidator.test(letter)) {
            return this.areChipsLowerCased ? letter.toLowerCase() : letter;
          }
        }).join('');
      }).filter(word => word.length);
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

  get chips(): Array<any> {
    return this.formControl.value;
  }

  get chips$(): Observable<Array<any>> {
    return this.formControl.valueChanges.pipe(startWith(this.chips));
  }
}
