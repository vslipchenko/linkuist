import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {AuthenticationService} from '@services/authentication/authentication.service';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  public constructor(private readonly authenticationService: AuthenticationService) {}

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
