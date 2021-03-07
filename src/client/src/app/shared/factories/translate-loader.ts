import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function translateLoaderFactory(
  assetsPathFragment: string,
): (http: HttpClient) => TranslateHttpLoader {
  return (http: HttpClient): TranslateHttpLoader =>
    new TranslateHttpLoader(http, `./assets/i18n/${assetsPathFragment}/`);
}
