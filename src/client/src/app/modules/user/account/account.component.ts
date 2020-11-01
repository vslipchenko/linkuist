import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {NavigationConfiguration, NavigationMainActionHref} from '../../../models/components/navigation';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    console.log('account access token is ', this.authenticationService.accessToken);
    console.log('account access tokenData is ', this.authenticationService.accessTokenData);
  }
}
