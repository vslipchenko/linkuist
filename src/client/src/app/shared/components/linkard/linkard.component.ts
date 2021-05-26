import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {DialogService} from '~app/shared/services/dialog/dialog.service';
import {LinkardPreview} from '~app/types/linkard/linkard.interfaces';

@Component({
  selector: 'app-linkard',
  templateUrl: './linkard.component.html',
  styleUrls: ['./linkard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkardComponent implements OnInit {
  @Input() public set linkard(linkard: LinkardPreview) {
    this.title = linkard.metadata.title || linkard.metadata.sitename || linkard.metadata.hostname;
    this.imageSrc = linkard.metadata.image || ''; // TODO
    if (linkard.metadata.icon) this.faviconSrc = linkard.metadata.icon || ''; // TODO
    this.text = {
      label: linkard.metadata.description ? 'Description' : 'Note',
      value: linkard.metadata.description || linkard.note,
    };
  }
  @ViewChild('openedCardContent') public openedCardContent: TemplateRef<unknown> | undefined;
  // @ViewChild('openedCardActions') public openedCardActions: TemplateRef<unknown> | undefined;
  public title = '';
  public imageSrc = '';
  public faviconSrc = '';
  public text = {label: '', value: ''};

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

  public handleFaviconError(): void {}
  public handleImageError(): void {}
}
