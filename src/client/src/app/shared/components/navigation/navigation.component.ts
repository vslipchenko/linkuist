import {Component, Input} from '@angular/core';
import {NavigationMainActionType} from '@typings/navigation/navigation.enums';
import {AuthenticationService} from '@services/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  // private readonly defaultConfiguration: NavigationConfiguration = {
  //   mainActionHref: NavigationMainActionHref.NONE
  // };
  @Input() public mainActionType: NavigationMainActionType | undefined;

  public constructor(private readonly authenticationService: AuthenticationService) {}

  public get tooltipContent(): string {
    switch (this.mainActionType) {
      case NavigationMainActionType.NONE:
        return NavigationMainActionType.NONE;
      case NavigationMainActionType.HOME:
        return NavigationMainActionType.HOME;
      case NavigationMainActionType.PROFILE:
        return NavigationMainActionType.PROFILE;
      default:
        return '';
    }
  }

  public get isUserAuthenticated(): boolean {
    return this.authenticationService.isUserAuthenticated;
  }

  public get userAccountPageUrl(): string {
    const username = this.authenticationService.accessTokenData?.username;
    return username ? `/@${username}` : '';
  }

  public get isProfileMainAction(): boolean {
    return this.isUserAuthenticated && this.mainActionType === NavigationMainActionType.PROFILE;
  }

  public get isHomeMainAction(): boolean {
    return this.mainActionType === NavigationMainActionType.HOME;
  }

  public get isHomeIconMainAction(): boolean {
    return this.isUserAuthenticated && this.isHomeMainAction;
  }

  public get isHomeTextMainAction(): boolean {
    return (
      !this.isUserAuthenticated &&
      (this.isHomeMainAction || this.mainActionType === NavigationMainActionType.NONE)
    );
  }
}
