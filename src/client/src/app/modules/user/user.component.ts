import {Component, OnInit} from '@angular/core';
import {ProgressBarService} from '../../shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {finalize, first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {extractUsername} from '../../utilities/url/url.utilities';
import {UserService} from '../../services/user/user.service';

enum UserComponentToRender {
  ACCOUNT = 'account',
  PROFILE = 'profile'
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  componentToRender: UserComponentToRender;

  constructor(private progressBarService: ProgressBarService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router) {
  }
  // define component to render
  ngOnInit(): void {
    this.progressBarService.show();

    const accessToken = this.authenticationService.accessToken;
    const refreshToken = this.authenticationService.refreshToken;

    const username = extractUsername(window.location.pathname);

    if (!username) {
      // 404
      this.router.navigate(['**'], {skipLocationChange: true});
    }

    if (refreshToken) {
      if (accessToken) {
        this.tryRenderAccount(username);
      } else {
        this.authenticationService.refreshAccessToken().pipe(
          first()
        ).subscribe(
          ({data: {accessTokenByRefreshToken}}) => {
            this.authenticationService.accessToken = accessTokenByRefreshToken;
            this.tryRenderAccount(username);
          },
          () => {
            this.tryRenderProfile(username);
          }
        );
      }
    } else {
      this.tryRenderProfile(username);
    }
  }

  private tryRenderAccount(username: string): void {
    const data = this.authenticationService.accessTokenData;

    if (data.username === username) {
      this.progressBarService.hide();
      this.componentToRender = UserComponentToRender.ACCOUNT;
    } else {
      this.tryRenderProfile(username);
    }
  }

  private tryRenderProfile(username: string): void {
    this.userService.getIdByUsername(username)
      .pipe(
        first(),
        finalize(() => this.progressBarService.hide())
      ).subscribe(
      ({data}) => {
        if (!data.userByUsername?._id) {
          this.router.navigate(['**'], {skipLocationChange: true});
        } else {
          this.componentToRender = UserComponentToRender.PROFILE;
        }
      },
      () => {
        // can't fulfill any of requests
        // TODO redirect to specific error page (service unavailable)
        this.router.navigate(['/']);
      }
    );
  }

  get userComponentToRender() {
    return UserComponentToRender;
  }
}
