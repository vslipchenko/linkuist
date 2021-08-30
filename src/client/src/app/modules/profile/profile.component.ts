import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '~app/services/user/user.service';
// import {ResolvedUser} from '~app/types/user/user.interfaces';
import {NavigationMainActionType} from '~app/shared/types/navigation/navigation.enums';
import {UserRole} from '~app/types/user/user.enums';
import {pathsMatch} from '~app/utilities/url';
import {DialogService} from '~app/shared/services/dialog/dialog.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
// import {ProfileService} from '~app/services/profile/profile.service';
import {ApolloQueryResult} from '@apollo/client/core/types';
import {
  Profile,
  ProfileByUserIdQueryResult,
  ProfileUpdateMutationResult,
} from '~app/types/profile/profile.interfaces';
import {FetchResult} from '@apollo/client/core';
import {finalize} from 'rxjs/operators';
import {ResolvedUserService} from '~app/services/resolved-user/resolved-user.service';
import {BehaviorSubject} from 'rxjs';
import {ProfileService} from '~app/services/profile/profile.service';

@UntilDestroy()
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @ViewChild('profileSettingsContent', {static: true}) public profileSettingsContent:
    | TemplateRef<unknown>
    | undefined;
  @ViewChild('profileSettingsActions', {static: true}) public profileSettingsActions:
    | TemplateRef<unknown>
    | undefined;

  // public resolvedUser: ResolvedUser = {
  //   role: UserRole.VIEWER,
  //   urlUsername: '',
  //   // relativePaths: []
  // };
  // public profile: Profile = {
  //   backgroundUrl: '',
  //   avatarUrl: '',
  //   name: '',
  //   bio: '',
  // };
  public profileSettingsForm = this.buildProfileSettingsForm();

  public constructor(
    private readonly resolvedUserService: ResolvedUserService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly progressBarService: ProgressBarService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
    // private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
  ) {
    // console.debug('PROFILE');
    // this.resolvedUser = this.route.snapshot.data.user as ResolvedUser;
    // this.resolvedUserService.user = this.route.snapshot.data.user as ResolvedUser;
    // console.log('called', this.resolvedUser);
    // this.userRoleService.userRole = UserRole.USER;
    console.log(this.resolvedUserService.user);
    this.loadProfile();

    this.profileService.userProfile$.pipe(untilDestroyed(this)).subscribe((profile) => {
      this.profileSettingsForm = this.buildProfileSettingsForm(profile);
    });

    // console.debug('CONSTRUCTOR');

    this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      if (event instanceof NavigationEnd) this.handlePageInnerNavigation();
    });
  }

  // ngOnInit() {
  //   console.debug('ONINIT');
  // }

  // public ngOnChanges() {
  //   this.changeDetector.detectChanges();
  // }

  // define component to render
  // public ngOnInit(): void {
  // console.log('CALLED');
  // this.changeDetector.detectChanges();
  // console.log('NEW', this.route.snapshot, this.route);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const profile: ResolvedUser =
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
  // }

  // public editProfile(): void {
  //   void this.router.navigate(['settings/profile']);
  // }

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

  public get isUser(): boolean {
    return this.resolvedUserService.user.role === UserRole.USER;
  }

  public get profile$(): BehaviorSubject<Profile> {
    return this.profileService.userProfile$;
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.isUser || !this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.HOME
      : NavigationMainActionType.PROFILE;
  }

  public confirmLogout(): void {
    this.authenticationService.resetTokens();
    void this.router.navigate(['sign-in']);
  }

  public openProfileSettings(): void {
    // debugger;
    // this.profileSettingsForm = this.buildProfileSettingsForm(
    //   this.profileService.userProfile$.value,
    // );

    const {dialogAfterClosed$} = this.dialogService.open({
      autoFocus: false,
      panelClass: 'profile-settings-dialog',
      data: {
        title: 'Profile settings',
        form: this.formBuilder.group({}),
        contentTemplateRef: this.profileSettingsContent,
        actionsTemplateRef: this.profileSettingsActions,
        // statusChanges$: this.addBookmarkForm?.statusChanges,
      },
    });

    dialogAfterClosed$.subscribe(() => {
      void this.router.navigate([`@${this.resolvedUserService.user.urlUsername}`]);
    });
  }

  public saveProfile(): void {
    this.progressBarService.show();
    this.userService
      .updateProfile(this.profileSettingsForm.value)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.dialogService.close();
          this.progressBarService.hide();
        }),
      )
      .subscribe(
        ({data}: FetchResult<ProfileUpdateMutationResult>) => {
          // Update profile property value
          // this.profile = data!.updateProfile.profile;
          this.profileService.userProfile$.next(data!.updateProfile.profile);
          // Trigger user section rerender
          // this.changeDetector.detectChanges();
        },
        () => {
          // Show error snackbar
        },
      );
  }

  private buildProfileSettingsForm(profile = this.profileService.userProfile$.value): FormGroup {
    return this.formBuilder.group({
      backgroundUrl: [profile.backgroundUrl],
      avatarUrl: [profile.avatarUrl],
      name: [profile.name],
      bio: [profile.bio],
    });
  }

  private loadProfile(): void {
    // const hasUserRole = this.resolvedUserService.user.role === UserRole.USER;

    this.userService
      .getProfileByUserId(this.resolvedUserService.user.id)
      .pipe(untilDestroyed(this))
      .subscribe(({data}: ApolloQueryResult<ProfileByUserIdQueryResult>) => {
        // debugger;
        const profile = data.profileByUserId.profile;
        this.profileService.userProfile$.next(profile);
        // debugger;

        // this.changeDetector.detectChanges();
      });
  }

  // private canProceedPageInnerNavigation(): boolean {
  //   if (this.resolvedUser.role === UserRole.Guest) {
  //     this.navigateToSignInPage();
  //     return false;
  //   }
  //
  //   if (this.resolvedUser.role === UserRole.Viewer) {
  //     this.navigateToResolvedUserProfile();
  //     return false;
  //   }
  //
  //   return true;
  // }

  private handlePageInnerNavigation(): void {
    // console.log(
    //   pathsMatch({
    //     // settings/profile
    //     paths: this.resolvedUser.relativePaths,
    //     testAgainst: ['settings', 'profile'],
    //   }),
    //   this.resolvedUser.relativePaths,
    // );
    // const paths = this.route.snapshot.parent?.url
    //   .slice(1) // Omit urlUsername path
    //   .map((segment) => segment.path) as Array<string>;
    // debugger;
    const paths = this.router
      .parseUrl(this.router.url)
      .root.children.primary.segments.slice(1)
      .map((segment) => segment.path);
    // if (!paths) return;
    console.debug(this.router.parseUrl(this.router.url).root.children);
    // console.debug(paths, this.resolvedUser);
    switch (true) {
      case pathsMatch({
        // settings/profile
        paths,
        testAgainst: ['settings', 'profile'],
      }):
        // console.debug('pathsMatch', paths);
        // if (!this.canProceedPageInnerNavigation()) return;
        if (this.resolvedUserService.user.role === UserRole.GUEST) {
          this.navigateToSignInPage();
          return;
        }

        if (this.resolvedUserService.user.role === UserRole.VIEWER) {
          this.navigateToResolvedUserProfile();
          return;
        }

        this.openProfileSettings();
        break;
    }
  }

  private navigateToResolvedUserProfile(): void {
    void this.router.navigate([`@${this.resolvedUserService.user.urlUsername}`]);
  }

  private navigateToSignInPage(): void {
    void this.router.navigate(['sign-in']);
  }
}
