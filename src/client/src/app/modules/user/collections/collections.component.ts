import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '../../../models/components/navigation';
import {DialogService} from '../../../shared/services/dialog/dialog.service';
import {DialogTypes} from '../../../models/components/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER, INSERT, SPACE} from '@angular/cdk/keycodes';
import {BookmarkType} from '../../../models/bookmark';
import {BOOKMARK_TAG_LETTER_REGEXP} from '../../../constants/validation';
import {Chip} from '../../../models/components/chips';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  readonly tagsSeparatorKeysCodes = [SPACE, COMMA, ENTER];
  readonly tagSeparatorKeyCode = INSERT;
  readonly tagRegExp = BOOKMARK_TAG_LETTER_REGEXP;

  // tagList = [
  //   {text: 'mine', isRemovable: true},
  //   'text',
  //   'tags'
  // ];

  readonly chips = {
    items: [
      {
        text: 'mine', isRemovable: true, isSelectable: true, onRemove: () => {
        }
      },
      'text',
      'tags'
    ],
    itemsAreSelectable: true,
    itemsAreRemovable: true,
    itemSeparatorKeyCodes: [ENTER, COMMA],
    input: {
      onItemAdd: (event) => {
      }
    },
    onRemove: () => {
    }
  };


  @ViewChild('addBookmarkContent') addBookmarkContent: TemplateRef<unknown>;

  addBookmarkForm: FormGroup;

  constructor(private dialogService: DialogService,
              private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.initAddBookmarkForm();
  }

  initAddBookmarkForm(): void {
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
      title: 'Bookmark',
      contentTemplateRef: this.addBookmarkContent,
      data: {form: this.addBookmarkForm},
      config: {
        panelClass: 'bookmark-dialog'
      }
    });
  }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }
}
