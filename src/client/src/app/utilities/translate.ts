import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateService} from '@ngx-translate/core';
import {DEFAULT_LANGUAGE} from '~app/constants/app';

export const translateLoaderFactory = (
  assetsPathFragment: string,
): ((http: HttpClient) => TranslateHttpLoader) => {
  return (http: HttpClient): TranslateHttpLoader =>
    new TranslateHttpLoader(http, `./assets/i18n/${assetsPathFragment}/`);
};

export const setupTranslate = (translateService: TranslateService): void => {
  translateService.setDefaultLang(DEFAULT_LANGUAGE);
  console.debug('BROWSER LANG: ', translateService.getBrowserLang());
  translateService.use(translateService.getBrowserLang() as string);
};
