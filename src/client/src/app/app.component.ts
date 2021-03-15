import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {CUSTOM_ICONS_FOLDER, ICONS, MATERIAL_ICONS_FOLDER} from '~app/constants/assets';
import {Icon} from '~app/types/assets/assets.interfaces';

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar></app-progress-bar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer, // private readonly translateService: TranslateService, // private readonly appTranslateService: AppTranslateService, // private readonly titleService: Title, // @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  public ngOnInit(): void {
    // const selectedLanguage = this.initTranslation();
    // this.setDocumentLanguage(selectedLanguage);
    // this.appTranslateService.setupTranslate(this.translateService);
    // this.setDocumentTitle();
    this.registerMaterialIcons();
  }

  // private initTranslation(): string {
  //   // const browserLanguage = this.translateService.getBrowserLang();
  //   // const selectedLanguage = this.supportedLanguages.includes(browserLanguage)
  //   //   ? browserLanguage
  //   //   : this.defaultLanguage;
  //   //
  //   // this.translateService.addLangs(this.supportedLanguages);
  //   // this.translateService.setDefaultLang(this.defaultLanguage);
  //   // this.translateService.use(selectedLanguage);
  //   // // console.log('default app is ', this.translateService.langs);
  //   //
  //   // return selectedLanguage;
  // }

  // private setDocumentLanguage(selectedLanguage: string): void {
  //   this.document.documentElement.lang = selectedLanguage;
  // }

  // private setDocumentTitle(): void {
  //   this.translateService.get('APP.TITLE').subscribe((title) => this.titleService.setTitle(title));
  //   //this.titleService.setTitle(this.translateService.instant('APP.TITLE'));
  // }

  private registerMaterialIcons(): void {
    const registerIcons = (icons: Array<Icon>): void => {
      icons.forEach((icon) => {
        this.matIconRegistry.addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            `${
              (icon.isMaterial && MATERIAL_ICONS_FOLDER) || (icon.isCustom && CUSTOM_ICONS_FOLDER)
            }${(icon.isOutlined && 'outlined/') || (icon.isFilled && 'filled/') || ''}${
              icon.fileName
            }.svg`,
          ),
        );
      });
    };

    registerIcons(ICONS);
  }
}
