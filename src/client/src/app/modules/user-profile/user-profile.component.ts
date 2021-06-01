import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  public resolvedUser: ResolvedUser = {role: UserRole.Viewer, urlUsername: ''};
  public readonly userRole = UserRole;

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly progressBarService: ProgressBarService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    // this.router.events.subscribe((event) => {
    //   // if (event instanceof NavigationEnd) {
    //   //   this.changeDetector.markForCheck();
    //   // if (event instanceof NavigationEnd) {
    //   //   console.log('NAVIGATION END', event);
    //   // }
    //   // }
    //   if (event instanceof NavigationEnd && event.url !== event.urlAfterRedirects) {
    //     // setTimeout(() => {
    //     // console.log('DETECT CHANGES ');
    //     // this.changeDetector.markForCheck();
    //     // }, 3000);
    //     console.log('HERE');
    //     window.location.reload();
    //   }
    // });
  }

  // public ngOnChanges() {
  //   this.changeDetector.detectChanges();
  // }

  // define component to render
  public ngOnInit(): void {
    this.resolvedUser = this.route.snapshot.data.user as ResolvedUser;
    // this.changeDetector.detectChanges();
    console.log('NEW', this.route.snapshot);

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

  public get isOwner(): boolean {
    return this.resolvedUser.role === UserRole.Owner;
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.isOwner ? NavigationMainActionType.HOME : NavigationMainActionType.PROFILE;
  }
}
