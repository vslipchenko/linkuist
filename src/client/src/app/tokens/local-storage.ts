// https://github.com/ng-web-apis/common/blob/master/projects/common/src/tokens/
import {inject, InjectionToken} from '@angular/core';
import {WINDOW} from '~app/tokens/window';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'An abstraction over window.localStorage object',
  {
    factory: (): Storage => inject(WINDOW).localStorage,
  },
);
