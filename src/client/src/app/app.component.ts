import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {MatIconRegistry} from '@angular/material/icon';

const ICONS_FOLDER = 'assets/icons/';
const MATERIAL_ICONS_FOLDER = 'assets/icons/material/';

interface IconInfo {
  name: string;
  fileName: string;
  isMaterial?: boolean;
}

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  private readonly defaultLanguage = 'en';
  private readonly supportedLanguages = ['en'];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    const selectedLanguage = this.initTranslation();
    this.setDocumentLanguage(selectedLanguage);
    this.setDocumentTitle();
    this.registerMaterialIcons();
  }

  private initTranslation(): string {
    const browserLanguage = this.translateService.getBrowserLang();
    const selectedLanguage = this.supportedLanguages.includes(browserLanguage)
      ? browserLanguage
      : this.defaultLanguage;

    this.translateService.addLangs(this.supportedLanguages);
    this.translateService.setDefaultLang(this.defaultLanguage);
    this.translateService.use(selectedLanguage);

    return selectedLanguage;
  }

  private setDocumentLanguage(selectedLanguage: string): void {
    this.document.documentElement.lang = selectedLanguage;
  }

  private setDocumentTitle(): void {
    this.translateService.get('APP.TITLE').subscribe(title => this.titleService.setTitle(title));
  }

  private registerMaterialIcons(): void {
    const registerIcons = (icons: IconInfo[]) => {
      icons.forEach(icon => {
        this.matIconRegistry.addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl((icon.isMaterial ? MATERIAL_ICONS_FOLDER : ICONS_FOLDER) + 'explore-white-18dp.svg')
        );
      })
    };

    registerIcons([
      {name: 'unicorn', fileName: 'explore-white-18dp.svg', isMaterial: true}
    ]);
  }
}
