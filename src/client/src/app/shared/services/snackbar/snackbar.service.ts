import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {SnackbarConfig} from '@app-types/components/snackbar';
import {MatSnackBarRef} from '@angular/material/snack-bar/snack-bar-ref';
import {TextOnlySnackBar} from '@angular/material/snack-bar/simple-snack-bar';

// TODO implement multiple snackbars
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) {
    // this.snackbar._openedSnackBarRef.instance.data;
  }

  private show(message: string, {action, config}: SnackbarConfig = {}): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(message, action, config);
  }

  showWithDismiss(message: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, {action: 'Dismiss', config});
  }

  showInfinite(message: string, {action, config}: SnackbarConfig = {}): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, {action, config: {duration: undefined, ...config}});
  }

  showSuccess(message = 'Success!'): void {
    this.show(`✔ ${message}`);
  }

  showError(message = 'Something went wrong during the request'): void {
    this.show(`❌ ${message}`);
  }

  hide(): void {
    this.snackbar.dismiss();
  }

  get isOpened(): boolean {
    return !!this.snackbar._openedSnackBarRef;
  }
}
