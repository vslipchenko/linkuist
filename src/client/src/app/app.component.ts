import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {ICONS, ICONS_FOLDER} from '~app/constants/assets';
// import {Icon} from '~app/types/assets/assets.interfaces';
import {NavigationMainActionType} from '~app/shared/types/navigation/navigation.enums';

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar></app-progress-bar>
    <router-outlet></router-outlet>
    <app-navigation
      class="backdrop-navigation"
      [mainActionType]="NavigationMainActionType.HOME"
    ></app-navigation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public readonly NavigationMainActionType = NavigationMainActionType;

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
    // const registerIcons = (icons: Array<Icon>): void => {
    //   icons.forEach((icon) => {
    //     this.matIconRegistry.addSvgIcon(
    //       icon.name,
    //       this.domSanitizer.bypassSecurityTrustResourceUrl(`${ICONS_FOLDER}${icon.fileName}.svg`),
    //     );
    //   });
    // };
    //
    // registerIcons(ICONS);
    ICONS.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${ICONS_FOLDER}${icon.fileName}.svg`),
      );
    });
  }
}
