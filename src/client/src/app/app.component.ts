import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  private readonly defaultLanguage = 'en';
  private readonly supportedLanguages = ['en'];

  constructor(private translateService: TranslateService,
              private titleService: Title,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    const selectedLanguage = this.initTranslation();
    this.setDocumentLanguage(selectedLanguage);
    this.setDocumentTitle();
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
}
