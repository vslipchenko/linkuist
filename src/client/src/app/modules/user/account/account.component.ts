import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@services/authentication/authentication.service';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {DialogService} from '@shared/services/dialog/dialog.service';
// import {DialogTypes} from '@@types/dialog/dialog.enums';

// TODO Consider visitor instead of profile and member instead of account
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
    // this.dialogService.open({type: DialogTypes.CONFIRM});
    // console.log('account access token is ', this.dialogService.gs());
  }

  // toggleAddNote(element: HTMLDivElement): void {
  //   element.classList.toggle('show');
  // }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.HOME;
  }
}
