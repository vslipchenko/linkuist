import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {DialogService} from '@shared/services/dialog/dialog.service';
// import {DialogTypes} from '@@types/dialog/dialog.enums';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ENTER} from '@angular/cdk/keycodes';
import {BookmarkType} from '@@types/bookmark/bookmark.enums';
import {BOOKMARK_TAG_LETTER_REGEXP} from '@constants/regexps';
import {Chip} from '@@types/chips/chips.interfaces';
import {UntilDestroy, untilDestroyed} from '@utilities/until-destroy';
import {BookmarkService} from '@services/bookmark/bookmark.service';

@UntilDestroy()
@Component({
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  readonly tagsSeparatorKeysCodes = [ENTER];
  readonly tagSeparator = '-';
  readonly tagLetterValidator = BOOKMARK_TAG_LETTER_REGEXP;
  readonly tagSplitWordBy = /[-\s]/;

  @ViewChild('addBookmarkContent') addBookmarkContent: TemplateRef<unknown>;
  @ViewChild('addBookmarkActions') addBookmarkActions: TemplateRef<unknown>;

  addBookmarkForm: FormGroup;

  constructor(
    private readonly dialogService: DialogService,
    private readonly bookmarkService: BookmarkService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  private initAddBookmarkForm(): void {
    // this.kek = 'awdwd';
    this.addBookmarkForm = this.formBuilder.group({
      link: [null, [Validators.required, BookmarksComponent.linkValidator]],
      title: [null],
      image: [null],
      icon: [null],
      description: [null],
      isPrivate: [false],
      tags: [
        [
          {
            text: BookmarkType.PUBLIC,
            isSelected: true,
            isRemovable: false,
            color: 'accent'
          } as Chip
        ]
      ]
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

  openAddBookmarkDialog(): void {
    this.initAddBookmarkForm();
    this.handlePrivateFieldValueChanges();

    this.dialogService.open({
      panelClass: 'bookmark-dialog',
      data: {
        title: 'Add bookmark',
        form: this.addBookmarkForm,
        contentTemplateRef: this.addBookmarkContent,
        actionsTemplateRef: this.addBookmarkActions
      }
    });
  }

  addBookmark(): void {
    this.addBookmarkForm.markAllAsTouched();
    if (this.addBookmarkForm.valid) {
      console.log('Add bookmark value ', this.addBookmarkForm.value);
      const tags = this.tagsField.value;
      tags[0] = this.privateField.value ? BookmarkType.PRIVATE : BookmarkType.PUBLIC; // simplify first element in order to match [String!]! constraint
      // debugger;
      // return;
      this.bookmarkService
        .create({
          id: new Date().getTime(),
          ...this.addBookmarkForm.value,
          tags
        })
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }

  private handlePrivateFieldValueChanges(): void {
    this.privateField.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((hasPrivateAccess: boolean) => {
        const tags = this.tagsField.value;
        tags.forEach((tag) => {
          if (tag.text === (hasPrivateAccess ? BookmarkType.PUBLIC : BookmarkType.PRIVATE)) {
            tag.text = hasPrivateAccess ? BookmarkType.PRIVATE : BookmarkType.PUBLIC;
          }
        });

        this.tagsField.setValue(tags);
      });
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

  get linkField(): AbstractControl {
    return this.addBookmarkForm.get('link');
  }

  private get privateField(): AbstractControl {
    return this.addBookmarkForm.get('isPrivate');
  }

  private get tagsField(): AbstractControl {
    return this.addBookmarkForm.get('tags');
  }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }
}
