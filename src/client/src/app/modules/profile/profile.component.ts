import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild} from '@angular/core';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {NavigationEnd, Router} from '@angular/router';
import {NavigationMainActionType} from '~app/shared/types/navigation/navigation.enums';
import {UserRole} from '~app/types/user/user.enums';
import {pathsMatch} from '~app/utilities/url';
import {DialogService} from '~app/shared/services/dialog/dialog.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {
  Profile,
  ProfileByUserIdQueryResult,
  ProfileTeasers,
  ProfileUpdateMutationResult,
} from '~app/types/profile/profile.interfaces';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Store} from '@ng-estate/store';
import {ProfileState} from '~app/modules/profile/store';
import {ProfileSelectors} from '~app/modules/profile/store/profile.selectors';
import {AppSelectors} from '~app/store/app.selectors';
import {ProfileActions} from '~app/modules/profile/store/profile.actions';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {DialogRef} from '~app/shared/types/dialog/dialog.interfaces';
import {ApolloQueryResult} from '@apollo/client/core/types';
import {FetchResult} from '@apollo/client/core';

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

  public profileSettingsForm = this.buildProfileSettingsForm();
  private profileSettingsDialogRef: DialogRef | undefined;
  private resolvedUser!: ResolvedUser;

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<ProfileState>,
  ) {
    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });

    this.loadProfile();

    // this.store.dispatch(ProfileActions.setCurrentUserProfileTeaser, {
    //   [this.resolvedUser.id]: {
    //     username: this.resolvedUser.urlUsername,
    //     avatarUrl: '',
    //   },
    // });

    this.store
      .select$<Profile>(ProfileSelectors.getProfile)
      .pipe(untilDestroyed(this))
      .subscribe((profile: Profile) => {
        // debugger;
        this.profileSettingsForm = this.buildProfileSettingsForm(profile);
      });

    // console.debug('CONSTRUCTOR');

    this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      if (event instanceof NavigationEnd) this.handlePageInnerNavigation();
    });
  }

  public get isUser(): boolean {
    return this.resolvedUser.role === UserRole.USER;
  }

  public get profile$(): Observable<Profile> {
    return this.store.select$(ProfileSelectors.getProfile);
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
    this.profileSettingsDialogRef = this.dialogService.open({
      autoFocus: false,
      panelClass: 'profile-settings-dialog',
      data: {
        title: 'Profile settings',
        form: this.formBuilder.group({}),
        contentTemplateRef: this.profileSettingsContent,
        actionsTemplateRef: this.profileSettingsActions,
      },
    });

    this.profileSettingsDialogRef.afterClosed().subscribe(() => {
      void this.router.navigate([`@${this.resolvedUser.urlUsername}`]);
    });
  }

  public saveProfile(): void {
    // this.progressBarService.show();
    this.store
      .dispatch$<FetchResult<ProfileUpdateMutationResult>>(
        ProfileActions.updateProfile,
        this.profileSettingsForm.value,
      )
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          console.log('finalize');
          this.profileSettingsDialogRef!.close();
          // this.progressBarService.hide();
        }),
      )
      .subscribe(({data}: FetchResult<ProfileUpdateMutationResult>) => {
        this.store.dispatch<ProfileTeasers>(ProfileActions.patchProfileTeasers, {
          [this.resolvedUser.id]: {
            // TODO: add possibility to change usernames as well
            avatarUrl: data!.updateProfile.profile.avatarUrl,
            username: this.resolvedUser.urlUsername,
          },
        });
      });
  }

  private buildProfileSettingsForm(
    profile = this.store.select<Profile>(ProfileSelectors.getProfile),
  ): FormGroup {
    return this.formBuilder.group({
      backgroundUrl: [profile.backgroundUrl],
      avatarUrl: [profile.avatarUrl],
      name: [profile.name],
      bio: [profile.bio],
    });
  }

  private loadProfile(): void {
    this.store
      .dispatch$<ApolloQueryResult<ProfileByUserIdQueryResult>>(
        ProfileActions.getProfileByUserId,
        this.resolvedUser.id,
      )
      .pipe(untilDestroyed(this))
      .subscribe(({data}: ApolloQueryResult<ProfileByUserIdQueryResult>) => {
        // Set current user _profile teaser
        this.store.dispatch<ProfileTeasers>(ProfileActions.patchProfileTeasers, {
          [this.resolvedUser.id]: {
            // TODO: add possibility to change usernames as well
            avatarUrl: data.profileByUserId.profile.avatarUrl,
            username: this.resolvedUser.urlUsername,
          },
        });
      });
  }

  private handlePageInnerNavigation(): void {
    // console.log(
    //   pathsMatch({
    //     // settings/_profile
    //     paths: this.resolvedUser.relativePaths,
    //     testAgainst: ['settings', '_profile'],
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
        // settings/_profile
        paths,
        testAgainst: ['settings', 'profile'],
      }):
        // console.debug('pathsMatch', paths);
        // if (!this.canProceedPageInnerNavigation()) return;

        if (this.resolvedUser.role === UserRole.GUEST) {
          this.navigateToSignInPage();
          return;
        }

        if (this.resolvedUser.role === UserRole.VIEWER) {
          this.navigateToResolvedUserProfile();
          return;
        }

        this.openProfileSettings();
        break;
    }
  }

  private navigateToResolvedUserProfile(): void {
    void this.router.navigate([`@${this.resolvedUser.urlUsername}`]);
  }

  private navigateToSignInPage(): void {
    void this.router.navigate(['sign-in']);
  }
}
