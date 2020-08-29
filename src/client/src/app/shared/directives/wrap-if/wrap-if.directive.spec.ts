import {WrapIfDirective} from './wrap-if.directive';
import {ElementRef} from '@angular/core';

describe('WrapIfDirective', () => {
  it('should create an instance', () => {
    const directive = new WrapIfDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
