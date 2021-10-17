import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import {ProgressBarMode} from '@angular/material/progress-bar/progress-bar';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {ThemePalette} from '@angular/material/core/common-behaviors/color';
import {SnackbarService} from '~app/shared/services/snackbar/snackbar.service';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  // @Input() public set show(isVisible: boolean) {
  //   console.log('SET ', isVisible);
  //   this.progressBarService[isVisible ? 'show' : 'hide']();
  // }

  public mode: ProgressBarMode = 'indeterminate';
  public color: ThemePalette = 'primary';
  public errorState = false;

  public constructor(
    private readonly router: Router,
    private readonly progressBarService: ProgressBarService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    // this.progressBarService.showProgressBar$.subscribe((showProgress) => {
    //   this.show = showProgress;
    //   this.changeDetector.detectChanges();
    // });
    this.router.events.subscribe((event: Event) => {
      // if (event instanceof ActivationStart) {
      this.handleNavigationProgress(event);
      // }
      // this.changeDetector.detectChanges();
    });
  }

  private handleNavigationProgress(event: Event): void {
    // console.log(event);
    switch (true) {
      case event instanceof NavigationStart:
        // this.errorState = false;
        // this.color = 'primary';
        // this.show = true;
        this.progressBarService.show();
        this.addBackgroundLogo();
        break;
      case event instanceof NavigationEnd:
        this.removeBackgroundLogo();
        // remove snackbar before navigation end
        // this.removeSnackbar();
        // this.show = false;
        this.progressBarService.hide();
        break;
      case event instanceof NavigationCancel:
      case event instanceof NavigationError:
        // console.log('THIS SHOW ', this.show);
        // this.errorState = true;
        // this.color = 'warn';
        // this.show = false;
        this.progressBarService.hide();

        // this.handleNavigationFailure();
        break;
    }
  }

  // private handleNavigationFailure(): void {
  //   this.snackbarService.showError('Something went wrong during navigation');
  //   setTimeout(() => {
  //     if (this.errorState) {
  //       this.show = false;
  //     } // actual duration + ~fadeout
  //   }, (SNACKBAR_CONFIG.duration as number) + 200);
  // }

  // private removeSnackbar(): void {
  //   if (this.snackbarService.isOpened) {
  //     this.snackbarService.hide();
  //   }
  // }

  public get showProgressBar$(): Observable<boolean> {
    return this.progressBarService.showProgressBar$;
  }

  private addBackgroundLogo(): void {
    if (!this.document.body.classList.contains('background-logo')) {
      this.document.body.classList.add('background-logo');
    }
  }

  private removeBackgroundLogo(): void {
    if (this.document.body.classList.contains('background-logo')) {
      this.document.body.classList.remove('background-logo');
    }
  }
}
