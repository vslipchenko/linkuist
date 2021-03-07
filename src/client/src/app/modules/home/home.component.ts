import {Component} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {AuthenticationService} from '@services/authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '@shared/services/app-translate/app-translate.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translateService: TranslateService,
    private readonly appTranslateService: AppTranslateService,
  ) {
    this.appTranslateService.setupTranslate(translateService);
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.NONE;
  }
}
