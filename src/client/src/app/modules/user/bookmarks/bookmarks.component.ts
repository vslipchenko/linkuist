import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '@models/components/navigation';
import {DialogService} from '@shared/services/dialog/dialog.service';
import {DialogTypes} from '@models/components/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {BookmarkType} from '@models/bookmark';
import {BOOKMARK_TAG_LETTER_REGEXP} from '@constants/validation';
import {Chip} from '@models/components/chips';

@Component({
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  readonly tagsSeparatorKeysCodes = [SPACE, COMMA, ENTER];
  readonly tagSeparator = '-';
  readonly tagRegExp = BOOKMARK_TAG_LETTER_REGEXP;

  @ViewChild('addBookmarkContent') addBookmarkContent: TemplateRef<unknown>;

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
      type: DialogTypes.ADD,
      title: 'Add bookmark',
      contentTemplateRef: this.addBookmarkContent,
      data: {form: this.addBookmarkForm},
      config: {
        panelClass: 'bookmark-dialog'
      }
    });
  }

  private handlePrivateFieldValueChanges(): void {
    this.privateField.valueChanges
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
