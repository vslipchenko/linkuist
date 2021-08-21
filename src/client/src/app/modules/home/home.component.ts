import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NavigationMainActionType} from '~app/shared/types/navigation/navigation.enums';
import {AuthenticationService} from '~app/services/authentication/authentication.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public constructor(
    private readonly authenticationService: AuthenticationService, // private readonly translateService: TranslateService, // private readonly appTranslateService: AppTranslateService,
  ) {
    // this.appTranslateService.setupTranslate(translateService);
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.NONE;
  }
}
