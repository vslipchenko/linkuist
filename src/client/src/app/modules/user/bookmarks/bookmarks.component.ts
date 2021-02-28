import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {BookmarkType} from '@@types/bookmark/bookmark.enums';
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
  public readonly tagsSeparatorKeysCodes = [ENTER];
  public readonly tagSeparator = '-';
  public readonly tagLetterValidator = BOOKMARK_TAG_LETTER_REGEXP;
  public readonly tagSplitWordBy = /[-\s]/;

  public addBookmarkForm: FormGroup | undefined;

  @ViewChild('addBookmarkContent') public addBookmarkContent: TemplateRef<unknown> | undefined;
  @ViewChild('addBookmarkActions') public addBookmarkActions: TemplateRef<unknown> | undefined;

  public constructor(
    private readonly dialogService: DialogService,
    private readonly bookmarkService: BookmarkService,
    private readonly formBuilder: FormBuilder,
  ) {}

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
    this.handlePrivateFieldValueChanges();

    this.dialogService.open({
      panelClass: 'bookmark-dialog',
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
      tags[0] = this.privateField?.value ? BookmarkType.PRIVATE : BookmarkType.PUBLIC; // simplify first element in order to match [String!]! constraint
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

  private handlePrivateFieldValueChanges(): void {
    this.privateField?.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((hasPrivateAccess: boolean) => {
        const tags = this.tagsField?.value;
        tags.forEach((tag: any) => {
          if (tag.text === (hasPrivateAccess ? BookmarkType.PUBLIC : BookmarkType.PRIVATE)) {
            tag.text = hasPrivateAccess ? BookmarkType.PRIVATE : BookmarkType.PUBLIC;
          }
        });

        this.tagsField?.setValue(tags);
      });
  }

  public get linkField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('link');
  }

  public get privateField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('isPrivate');
  }

  public get tagsField(): AbstractControl | null | undefined {
    return this.addBookmarkForm?.get('tags');
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }
}
