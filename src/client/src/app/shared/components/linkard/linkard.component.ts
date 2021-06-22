import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {DialogService} from '~app/shared/services/dialog/dialog.service';
import {LinkardPreview} from '~app/types/linkard/linkard.interfaces';
import {decodeHtmlEntities} from '~app/utilities/decode';

@Component({
  selector: 'app-linkard',
  templateUrl: './linkard.component.html',
  styleUrls: ['./linkard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkardComponent implements OnInit {
  @Input() public set linkard(linkard: LinkardPreview) {
    this.title =
      decodeHtmlEntities(
        linkard.metadata.title || linkard.metadata.sitename || linkard.metadata.hostname,
      ) || '';
    this.imageSrc = linkard.metadata.image || ''; // TODO
    if (linkard.metadata.icon) this.faviconSrc = linkard.metadata.icon || ''; // TODO
    this.text = {
      label: linkard.metadata.description ? 'Description' : 'Note',
      value:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      // TODO dont forget to decode!!!
      // value: 'small',
      // value: '',
    };
    this.changeDetector.detectChanges();
  }
  @ViewChild('openedCardContent') public openedCardContent: TemplateRef<unknown> | undefined;
  // @ViewChild('openedCardActions') public openedCardActions: TemplateRef<unknown> | undefined;
  public title = '';
  public imageSrc = '';
  public faviconSrc = '';
  public text = {label: '', value: ''};
  public liked = false;
  public shared = false;

  // @HostListener('window:resize') test() {
  //   console.log('resize');
  // }

  public constructor(
    private readonly dialogService: DialogService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

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

  // counter = 0;
  // test() {
  //   console.log('resize');
  // }

  public like(): void {
    this.liked = !this.liked;
  }

  public shareTo(): void {
    this.shared = !this.shared;
  }

  public handleFaviconError(event: Event): void {
    console.log('favicon error');
    // if (this.counter) return;
    // (event.target as HTMLImageElement).src = '/assets/images/shared/placeholder.jpg';
    // this.counter++;
    this.faviconSrc = '';
  }
  public handleImageError(event: Event): void {
    console.log('image error');
    // (event.target as HTMLImageElement).src = '/assets/images/shared/placeholder.jpg';
    this.imageSrc = '';
  }
}
