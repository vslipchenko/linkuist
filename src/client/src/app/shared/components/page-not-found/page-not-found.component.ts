import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  public statusCode = 404;

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
  ) {
    const statusCode = this.router.getCurrentNavigation()?.extras.state?.statusCode;
    if (statusCode) this.statusCode = statusCode;
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
