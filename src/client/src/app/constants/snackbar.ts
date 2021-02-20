import {MatSnackBarConfig} from '@angular/material/snack-bar';

export const SNACKBAR_CONFIG: MatSnackBarConfig = {
  ...new MatSnackBarConfig(),
  duration: 3500,
  verticalPosition: 'top',
  horizontalPosition: 'right',
  panelClass: ['snackbar--theme-light'],
};
