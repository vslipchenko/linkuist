import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-elastic-input',
  templateUrl: './elastic-input.component.html',
  styleUrls: ['./elastic-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ElasticInputComponent),
      multi: true,
    },
  ],
})
export class ElasticInputComponent implements ControlValueAccessor {
  @Input() public readonly placeholder = '';
  @Input() public readonly extendClass = '';
  @Input() public readonly maxCharacterLength = 0;
  @Output() public readonly inputChange = new EventEmitter<Event>();

  // public value = '';
  @ViewChild('input', {static: true}) public readonly spanElement: ElementRef | undefined;

  public isCounterVisible = false;

  public constructor(
    @Inject(DOCUMENT) public readonly document: Document,
    private readonly renderer: Renderer2,
  ) {}

  public handleInput(event: Event): void {
    // console.log((event.target as HTMLSpanElement).textContent);
    // this.value = (event.target as HTMLSpanElement).textContent as string;
    this.onChange((event.target as HTMLSpanElement).textContent);
    this.inputChange.emit(event);
  }

  public handleFocus(): void {
    this.onTouch();
    this.isCounterVisible = true;
  }

  public handleBlur(): void {
    // this.onTouch();
    this.isCounterVisible = false;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public writeValue(value: string): void {
    this.renderer.setProperty(this.spanElement?.nativeElement, 'textContent', value);
  }

  private onChange = (value: any): void => value;
  private onTouch = (): void => {};
}
