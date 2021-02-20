import {MatDialogConfig} from '@angular/material/dialog';

export const DIALOG_CONFIG: MatDialogConfig = {
  ...new MatDialogConfig(),
  closeOnNavigation: true,
};
