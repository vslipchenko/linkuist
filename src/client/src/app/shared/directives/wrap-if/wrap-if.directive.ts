import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appWrapIf]',
})
export class WrapIfDirective implements AfterViewInit {
  private wrap: boolean | undefined;

  public constructor(private readonly templateRef: ElementRef) {}

  private static unwrapChildNodes(wrapper: HTMLElement): void {
    // place childNodes in document fragment
    const documentFragment = document.createDocumentFragment();
    // while child nodes exist
    while (wrapper.firstChild) {
      const child = wrapper.removeChild(wrapper.firstChild);
      documentFragment.appendChild(child);
    }
    // replace wrapper with document fragment
    wrapper?.parentNode?.replaceChild(documentFragment, wrapper);
  }

  public ngAfterViewInit(): void {
    if (!this.wrap) {
      WrapIfDirective.unwrapChildNodes(this.templateRef.nativeElement);
    }
  }

  @Input() public set appWrapIf(condition: unknown) {
    this.wrap = Boolean(condition);
  }
}
