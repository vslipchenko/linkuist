import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  show(message: string, action = 'Dismiss', config?: MatSnackBarConfig): void {
    this.snackBar.open(message, action, config);
  }
}
