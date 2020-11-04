import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '../../models/components/navigation';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.NONE;
  }
}
