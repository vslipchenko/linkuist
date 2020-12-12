import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '@app-types/components/navigation';
import {AuthenticationService} from '@services/authentication/authentication.service';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
