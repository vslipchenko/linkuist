import {Component, OnInit} from '@angular/core';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {finalize, first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {extractUsername} from '~app/utilities/url';
import {UserService} from '~app/services/user/user.service';

enum UserComponentToRender {
  ACCOUNT = 'account',
  PROFILE = 'profile',
}

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public componentToRender: UserComponentToRender | undefined;

  public constructor(
    private readonly progressBarService: ProgressBarService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  // define component to render
  public ngOnInit(): void {
    this.progressBarService.show();

    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;

    const username = extractUsername(window.location.pathname);

    if (!username) {
      // 404
      void this.router.navigate(['**'], {skipLocationChange: true});
      return;
    }

    if (refreshToken && accessToken) {
      this.tryRenderAccount(username);
    } else {
      this.tryRenderProfile(username);
    }
  }

  private tryRenderAccount(username: string): void {
    const data = this.authenticationService.accessTokenData;

    if (data?.username === username) {
      this.progressBarService.hide();
      this.componentToRender = UserComponentToRender.ACCOUNT;
    } else {
      this.tryRenderProfile(username);
    }
  }

  private tryRenderProfile(username: string): void {
    this.userService
      .getIdByUsername(username)
      .pipe(
        first(),
        finalize(() => this.progressBarService.hide()),
      )
      .subscribe(
        ({data}) => {
          if (!data.userByUsername?._id) {
            void this.router.navigate(['**'], {skipLocationChange: true});
          } else {
            this.componentToRender = UserComponentToRender.PROFILE;
          }
        },
        () => {
          // can't fulfill any of requests
          // TODO redirect to specific error page (service unavailable)
          void this.router.navigate(['/']);
        },
      );
  }

  public get userComponentToRender(): typeof UserComponentToRender {
    return UserComponentToRender;
  }
}
