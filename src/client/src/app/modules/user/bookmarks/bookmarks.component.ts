import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {DialogService} from '@shared/services/dialog/dialog.service';
// import {DialogTypes} from '@@types/dialog/dialog.enums';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {BookmarkType} from '@@types/bookmark/bookmark.enums';
import {BOOKMARK_TAG_LETTER_REGEXP} from '@constants/validation';
import {Chip} from '@@types/chips/chips.interfaces';
import {UntilDestroy, untilDestroyed} from '@utilities/until-destroy';

@UntilDestroy()
@Component({
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  readonly tagsSeparatorKeysCodes = [SPACE, COMMA, ENTER];
  readonly tagSeparator = '-';
  readonly tagRegExp = BOOKMARK_TAG_LETTER_REGEXP;

  @ViewChild('addBookmarkContent') addBookmarkContent: TemplateRef<unknown>;
  @ViewChild('addBookmarkActions') addBookmarkActions: TemplateRef<unknown>;

  addBookmarkForm: FormGroup;

  constructor(private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initAddBookmarkForm();
    this.handlePrivateFieldValueChanges();
  }


  private initAddBookmarkForm(): void {
    // this.kek = 'awdwd';
    this.addBookmarkForm = this.formBuilder.group({
      link: [null, [Validators.required]],
      title: [null],
      thumbnail: [null],
      description: [null],
      private: [false],
      tags: [[{
        text: BookmarkType.PUBLIC,
        isSelected: true,
        isRemovable: false,
        color: 'accent'
      } as Chip]]
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

  addBookmark(): void {
    this.dialogService.open({
      panelClass: 'bookmark-dialog',
      data: {
        title: 'Add bookmark',
        contentTemplateRef: this.addBookmarkContent,
        actionsTemplateRef: this.addBookmarkActions,
        form: this.addBookmarkForm
      }
    });
  }

  saveBookmark(): void {

  }

  private handlePrivateFieldValueChanges(): void {
    this.privateField.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((hasPrivateAccess) => {
        const tags = this.tagsField.value;
        tags.forEach((tag) => {
          if (tag.text === (hasPrivateAccess ? BookmarkType.PUBLIC : BookmarkType.PRIVATE)) {
            tag.text = hasPrivateAccess ? BookmarkType.PRIVATE : BookmarkType.PUBLIC;
          }
        });

        this.tagsField.setValue(tags);
      });
  }

  private get privateField(): AbstractControl {
    return this.addBookmarkForm.get('private');
  }

  private get tagsField(): AbstractControl {
    return this.addBookmarkForm.get('tags');
  }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }
}
