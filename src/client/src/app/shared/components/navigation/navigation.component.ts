import {Component, Input, OnInit} from '@angular/core';
import {NavigationMainActionType} from '../../../models/components/navigation';
import {AuthenticationService} from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // private readonly defaultConfiguration: NavigationConfiguration = {
  //   mainActionHref: NavigationMainActionHref.NONE
  // };
  @Input() mainActionType: NavigationMainActionType;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    // console.log('WOW ', this.route.snapshot.pathFromRoot.filter(o => o.url[0]?.path).map(o => o.url[0]?.path));
    // console.log('WOW ', extractUsername('/wad/ahah'));
  }

  get tooltipContent(): string {
    switch (this.mainActionType) {
      case this.mainActionTypes.NONE:
        return this.mainActionTypes.NONE;
      case this.mainActionTypes.HOME:
        return this.mainActionTypes.HOME;
      case this.mainActionTypes.PROFILE:
        return this.mainActionTypes.PROFILE;
    }
  }

  get isUserAuthenticated(): boolean {
    return this.authenticationService.isUserAuthenticated;
  }

  get userAccountPageUrl(): string {
    return `/@${this.authenticationService.accessTokenData.username}`;
  }

  get mainActionTypes(): typeof NavigationMainActionType {
    return NavigationMainActionType;
  }
}
