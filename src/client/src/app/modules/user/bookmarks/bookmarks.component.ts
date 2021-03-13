import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {DialogService} from '@shared/services/dialog/dialog.service';
// import {DialogTypes} from '@@types/dialog/dialog.enums';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {ENTER} from '@angular/cdk/keycodes';
import {BookmarkPrice, BookmarkPrivacy} from '@@types/bookmark/bookmark.enums';
import {BOOKMARK_TAG_LETTER_REGEXP} from '@constants/regexps';
import {Chip} from '@@types/chips/chips.interfaces';
import {UntilDestroy, untilDestroyed} from '@utilities/until-destroy';
import {BookmarkService} from '@services/bookmark/bookmark.service';

@UntilDestroy()
@Component({
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent {
  @ViewChild('addBookmarkContent') public addBookmarkContent: TemplateRef<unknown> | undefined;
  @ViewChild('addBookmarkActions') public addBookmarkActions: TemplateRef<unknown> | undefined;

  public readonly tagsSeparatorKeysCodes = [ENTER];
  public readonly tagSeparator = '-';
  public readonly tagLetterValidator = BOOKMARK_TAG_LETTER_REGEXP;
  public readonly tagSplitWordBy = /[-\s]/;

  public addBookmarkForm: FormGroup | undefined;

  public constructor(
    private readonly dialogService: DialogService,
    private readonly bookmarkService: BookmarkService,
    private readonly formBuilder: FormBuilder,
  ) {}

  public get linkField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('link');
  }

  public get privacyField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('isPrivate');
  }

  public get priceField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('isPaid');
  }

  public get tagsField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('tags');
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }

  private static linkValidator(control: AbstractControl): null | ValidationErrors {
    const link = control.value;
    if (link?.length) {
      try {
        const url = new URL(link);
        const isSupportedProtocol = url.protocol === 'http:' || url.protocol === 'https:';
        return isSupportedProtocol ? null : {pattern: true};
        // this.linkField.setValue(url);
      } catch {
        return {pattern: true};
      }
    }
    return null;
  }

  public openAddBookmarkDialog(): void {
    this.initAddBookmarkForm();
    this.handlePrivateFieldValueChange();
    this.handlePriceFieldValueChange();

    this.dialogService.open({
      panelClass: 'dialog-small',
      data: {
        title: 'Add bookmark',
        form: this.addBookmarkForm,
        contentTemplateRef: this.addBookmarkContent,
        actionsTemplateRef: this.addBookmarkActions,
      },
    });
  }

  public addBookmark(): void {
    this.addBookmarkForm?.markAllAsTouched();
    if (this.addBookmarkForm?.valid) {
      console.log('Add bookmark value ', this.addBookmarkForm.value);
      const tags = this.tagsField?.value;
      tags[0] = this.privacyField?.value ? BookmarkPrivacy.PRIVATE : BookmarkPrivacy.PUBLIC; // simplify first element in order to match [String!]! constraint
      // debugger;
      // return;
      this.bookmarkService
        .create({
          id: new Date().getTime(),
          ...this.addBookmarkForm.value,
          tags,
        })
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }

  private initAddBookmarkForm(): void {
    // this.kek = 'awdwd';
    this.addBookmarkForm = this.formBuilder.group({
      link: [null, [Validators.required.bind(this), BookmarksComponent.linkValidator.bind(this)]],
      // title: [null],
      // image: [null],
      // icon: [null],
      note: [null],
      isPrivate: [false],
      isPaid: [false],
      tags: [
        [
          {
            text: BookmarkPrivacy.PUBLIC,
            isSelected: true,
            isRemovable: false,
            color: 'accent',
          } as Chip,
          {
            text: BookmarkPrice.FREE,
            isSelected: true,
            isRemovable: false,
            color: 'accent',
          } as Chip,
        ],
      ],
    });

    // this.addBookmarkForm.next(
    //   this.formBuilder.group({
    //       link: [null, [Validators.required]],
    //       title: [null],
    //       thumbnail: [null],
    //       description: [null],
    //       private: [false],
    //       tags: [[]]
    //     })
    // );
    // this.addBookmarkForm = new FormGroup({});
  }

  private handlePrivateFieldValueChange(): void {
    this.privacyField?.valueChanges.pipe(untilDestroyed(this)).subscribe((isPrivate: boolean) => {
      const tags = this.tagsField?.value;

      if (isPrivate) {
        tags[0].text = BookmarkPrivacy.PRIVATE;
        // reset and disable price field & avoid valueChange trigger
        tags[1].text = BookmarkPrice.FREE;
        this.priceField?.setValue(false, {emitEvent: false});
        this.priceField?.disable({emitEvent: false});
      } else {
        tags[0].text = BookmarkPrivacy.PUBLIC;
        // enable price field & avoid valueChange trigger
        this.priceField?.enable({emitEvent: false});
      }
      tags[0].text = isPrivate ? BookmarkPrivacy.PRIVATE : BookmarkPrivacy.PUBLIC;

      this.tagsField?.setValue(tags);
    });
  }

  private handlePriceFieldValueChange(): void {
    this.priceField?.valueChanges.pipe(untilDestroyed(this)).subscribe((isPaid: boolean) => {
      const tags = this.tagsField?.value;
      tags[1].text = isPaid ? BookmarkPrice.PAID : BookmarkPrice.FREE;

      this.tagsField?.setValue(tags);
    });
  }
}
