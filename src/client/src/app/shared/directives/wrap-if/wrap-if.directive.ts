import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appWrapIf]',
})
export class WrapIfDirective implements AfterViewInit {
  private wrap: boolean;

  constructor(private readonly templateRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (!this.wrap) {
      WrapIfDirective.unwrapChildNodes(this.templateRef.nativeElement);
    }
  }

  private static unwrapChildNodes(wrapper): void {
    // place childNodes in document fragment
    const documentFragment = document.createDocumentFragment();
    // while child nodes exist
    while (wrapper.firstChild) {
      const child = wrapper.removeChild(wrapper.firstChild);
      documentFragment.appendChild(child);
    }
    // replace wrapper with document fragment
    wrapper.parentNode.replaceChild(documentFragment, wrapper);
  }

  @Input() set appWrapIf(condition: unknown) {
    this.wrap = !!condition;
  }
}
