import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '~app/services/user/user.service';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {UserRole} from '~app/types/user/user.enums';

@Component({
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  public user: ResolvedUser | undefined;
  public readonly userRole = UserRole;

  public constructor(
    private readonly progressBarService: ProgressBarService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.user = this.route.snapshot.data.user as ResolvedUser;
  }

  // define component to render
  public ngOnInit(): void {
    console.log(this.route.snapshot);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const user-profile: ResolvedUser =
    // this.progressBarService.show();
    //
    // const accessToken = this.authenticationService.accessToken;
    // const refreshToken = this.authenticationService.refreshToken;
    //
    // const username = extractUsername(window.location.pathname);
    //
    // if (!username) {
    //   // 404
    //   void this.router.navigate(['**'], {skipLocationChange: true});
    //   return;
    // }
    //
    // if (refreshToken && accessToken) {
    //   this.tryRenderAccount(username);
    // } else {
    //   this.tryRenderProfile(username);
    // }
  }

  public confirmLogout(): void {}

  // private tryRenderAccount(username: string): void {
  //   const data = this.authenticationService.accessTokenData;
  //
  //   if (data?.username === username) {
  //     this.progressBarService.hide();
  //     this.componentToRender = UserComponentToRender.ACCOUNT;
  //   } else {
  //     this.tryRenderProfile(username);
  //   }
  // }
  //
  // private tryRenderProfile(username: string): void {
  //   this.userService
  //     .getIdByUsername(username)
  //     .pipe(
  //       first(),
  //       finalize(() => this.progressBarService.hide()),
  //     )
  //     .subscribe(
  //       ({data}) => {
  //         if (!data.userByUsername?._id) {
  //           void this.router.navigate(['**'], {skipLocationChange: true});
  //         } else {
  //           this.componentToRender = UserComponentToRender.PROFILE;
  //         }
  //       },
  //       () => {
  //         // can't fulfill any of requests
  //         // TODO redirect to specific error page (service unavailable)
  //         void this.router.navigate(['/']);
  //       },
  //     );
  // }
  //
  // public get userComponentToRender(): typeof UserComponentToRender {
  //   return UserComponentToRender;
  // }

  public get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.HOME;
  }
}
