import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {SnackbarConfig} from '@@types/snackbar/snackbar.interfaces';
import {MatSnackBarRef} from '@angular/material/snack-bar/snack-bar-ref';
import {TextOnlySnackBar} from '@angular/material/snack-bar/simple-snack-bar';

// TODO implement multiple snackbars
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public constructor(private readonly snackbar: MatSnackBar) {
    // this.snackbar._openedSnackBarRef.instance.data;
  }

  public showInfinite(
    message: string,
    {action, config}: SnackbarConfig = {},
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, {action, config: {duration: undefined, ...config}});
  }

  public showWithDismiss(
    message: string,
    config?: MatSnackBarConfig,
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, {action: 'Dismiss', config});
  }

  private show(
    message: string,
    {action, config}: SnackbarConfig = {},
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, action, config);
  }

  public showSuccess(message = 'Success!'): void {
    this.show(`✔ ${message}`);
  }

  public showError(message = 'Something went wrong during the request'): void {
    this.show(`❌ ${message}`);
  }

  public hide(): void {
    this.snackbar.dismiss();
  }

  public get isOpened(): boolean {
    return Boolean(this.snackbar._openedSnackBarRef);
  }
}
