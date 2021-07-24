import {inject, InjectionToken} from '@angular/core';
import {DOCUMENT} from '@angular/common';
// https://github.com/ng-web-apis/common/blob/master/projects/common/src/tokens/
export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
  factory: (): Window => {
    const {defaultView} = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  },
});
