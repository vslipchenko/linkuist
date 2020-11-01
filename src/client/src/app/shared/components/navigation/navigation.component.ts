import {Component, Input, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../../models/components/navigation';
import {AuthenticationService} from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  private readonly defaultConfiguration: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.NONE
  };

  @Input() configuration = this.defaultConfiguration;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    console.log('wawdwd', this.configuration.mainActionHref && this.isUserAuthenticated)
  }

  get tooltipContent(): string {
    switch (this.configuration.mainActionHref) {
      // assume not authenticated; home page
      case !this.isUserAuthenticated && NavigationMainActionHref.NONE:
        return '';
      case NavigationMainActionHref.HOME:
        return 'Home';
      // assume authenticated; profile page
      default: // assume account
        return 'Profile';
    }
  }

  get isUserAuthenticated(): boolean {
    console.log('isUserAuthenticated ',this.authenticationService.isUserAuthenticated);
    return this.authenticationService.isUserAuthenticated;
  }

  get userAccountPageUrl(): string {
    return `/@${this.authenticationService.accessTokenData.username}`;
  }
}
