import {MatChipEvent} from '@angular/material/chips/chip';
import {ThemePalette} from '@angular/material/core/common-behaviors/color';

export interface Chip {
  text: string;
  isRemovable?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  color?: ThemePalette;
  onRemove?: (event: MatChipEvent) => unknown;
}
