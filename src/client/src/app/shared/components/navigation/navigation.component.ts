import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {AuthenticationService} from '~app/services/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  // private readonly defaultConfiguration: NavigationConfiguration = {
  //   mainActionHref: NavigationMainActionHref.NONE
  // };

  // Main action states in regard to user:
  // User logged-in & on the self profile page
  // User logged in & on a page different from the profile
  // Visitor not signed-in on the home screen
  // Visitor signed-in on a page different from the profile page
  @Input() public mainActionType = NavigationMainActionType.NONE;

  public constructor(private readonly authenticationService: AuthenticationService) {}

  // public ngOnInit(): void {
  //   console.log(
  //     this.mainActionType,
  //     this.isProfileMainAction,
  //     this.isHomeIconMainAction,
  //     this.isHomeTextMainAction,
  //     this.isHomeMainAction,
  //   );
  // }

  public get tooltipContent(): string {
    return this.mainActionType;
    // switch (this.mainActionType) {
    //   case NavigationMainActionType.NONE:
    //     return NavigationMainActionType.NONE;
    //   case NavigationMainActionType.HOME:
    //     return NavigationMainActionType.HOME;
    //   case NavigationMainActionType.PROFILE:
    //     return NavigationMainActionType.PROFILE;
    //   default:
    //     return '';
    // }
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
