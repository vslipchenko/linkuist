import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {
  private readonly defaultLanguage = 'en';
  // private readonly defaultSupportedLanguages = ['en'];

  public setupTranslate(
    translateService: TranslateService,
    // supportedLanguages?: Array<string>,
  ): void {
    const browserLanguage = translateService.getBrowserLang();
    // const selectedLanguage = (supportedLanguages || this.defaultSupportedLanguages).includes(
    //   browserLanguage,
    // )
    //   ? browserLanguage
    //   : this.defaultLanguage;

    // translateService.addLangs(this.supportedLanguages);
    translateService.setDefaultLang(this.defaultLanguage);
    translateService.use(browserLanguage);
  }
}
