import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {MatIconRegistry} from '@angular/material/icon';

const ICONS_FOLDER = 'assets/icons/';
const CUSTOM_ICONS_FOLDER = `${ICONS_FOLDER}custom/`;
const MATERIAL_ICONS_FOLDER = `${ICONS_FOLDER}material/`;

interface IconInfo {
  name: string;
  fileName: string;
  isMaterial?: boolean;
  isFilled?: boolean;
  isOutlined?: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar></app-progress-bar>
    <router-outlet></router-outlet>
  `
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
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            `${icon.isMaterial ? MATERIAL_ICONS_FOLDER : CUSTOM_ICONS_FOLDER}${(icon.isOutlined && 'outlined/') || (icon.isFilled && 'filled/') || ''}${icon.fileName}.svg`
          )
        );
      })
    };

    registerIcons([
      {name: 'login', fileName: 'login-24px', isMaterial: true, isOutlined: true},
      {name: 'person-add', fileName: 'person_add-24px', isMaterial: true, isFilled: true},
      {name: 'explore', fileName: 'explore-24px', isMaterial: true, isOutlined: true},
      {name: 'architecture', fileName: 'architecture-24px', isMaterial: true, isOutlined: true},
      {name: 'share', fileName: 'share-24px', isMaterial: true, isOutlined: true},
      {name: 'support', fileName: 'support-24px', isMaterial: true, isOutlined: true},
      {name: 'visibility', fileName: 'visibility-24px', isMaterial: true, isFilled: true},
      {name: 'visibility-off', fileName: 'visibility_off-24px', isMaterial: true, isFilled: true},
      // {name: 'google', fileName: 'google-24px', isOutlined: true},
      // {name: 'facebook', fileName: 'facebook-24px', isOutlined: true}
    ]);
  }
}
