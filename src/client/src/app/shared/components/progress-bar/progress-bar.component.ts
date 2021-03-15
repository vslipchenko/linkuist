import {Component, Inject, OnInit} from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import {ProgressBarMode} from '@angular/material/progress-bar/progress-bar';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {ThemePalette} from '@angular/material/core/common-behaviors/color';
import {SnackbarService} from '~app/shared/services/snackbar/snackbar.service';
import {SNACKBAR_CONFIG} from '~app/constants/snackbar';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  public mode: ProgressBarMode = 'indeterminate';
  public color: ThemePalette = 'primary';
  public errorState = false;
  public show = false;

  public constructor(
    private readonly router: Router,
    private readonly progressBarService: ProgressBarService,
    private readonly snackbarService: SnackbarService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.progressBarService.showProgressBar$.subscribe(
      (showProgress) => (this.show = showProgress),
    );
    this.router.events.subscribe((event: Event) => {
      this.handleNavigationProgress(event);
    });
  }

  private handleNavigationProgress(event: Event): void {
    switch (true) {
      case event instanceof NavigationStart:
        this.errorState = false;
        this.color = 'primary';
        this.show = true;
        break;
      case event instanceof NavigationEnd:
        this.removeBackgroundLogo();
        // remove snackbar before navigation end
        this.removeSnackbar();
        this.show = false;
        break;
      case event instanceof NavigationCancel:
      case event instanceof NavigationError:
        this.errorState = true;
        this.color = 'warn';

        this.handleNavigationFailure();
        break;
    }
  }

  private handleNavigationFailure(): void {
    this.snackbarService.showError('Something went wrong during navigation');
    setTimeout(() => {
      if (this.errorState) {
        this.show = false;
      } // actual duration + ~fadeout
    }, (SNACKBAR_CONFIG.duration as number) + 200);
  }

  private removeSnackbar(): void {
    if (this.snackbarService.isOpened) {
      this.snackbarService.hide();
    }
  }

  private removeBackgroundLogo(): void {
    if (this.document.body.classList.contains('background-logo')) {
      this.document.body.classList.remove('background-logo');
    }
  }
}
