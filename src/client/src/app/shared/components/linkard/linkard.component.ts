import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogService} from '~app/shared/services/dialog/dialog.service';

@Component({
  selector: 'app-linkard',
  templateUrl: './linkard.component.html',
  styleUrls: ['./linkard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkardComponent implements OnInit {
  @ViewChild('openedCardContent') public openedCardContent: TemplateRef<unknown> | undefined;
  // @ViewChild('openedCardActions') public openedCardActions: TemplateRef<unknown> | undefined;

  public constructor(private readonly dialogService: DialogService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  public ngOnInit(): void {}

  public openCard(): void {
    this.dialogService.open({
      panelClass: 'dialog-no-spacing',
      autoFocus: false,
      data: {
        contentTemplateRef: this.openedCardContent,
        // actionsTemplateRef: this.openedCardActions,
        // statusChanges$: this.addBookmarkForm?.statusChanges,
      },
    });
  }
}
