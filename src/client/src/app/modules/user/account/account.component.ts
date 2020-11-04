import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {NavigationMainActionType} from '../../../models/components/navigation';
import {DialogService} from '../../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {

    console.log('account access tokenData is ', this.authenticationService.accessTokenData);
  }

  confirmLogout(): void {
    this.dialogService.open({type: 'confirmation'});
    // console.log('account access token is ', this.dialogService.gs());
  }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.HOME;
  }
}
