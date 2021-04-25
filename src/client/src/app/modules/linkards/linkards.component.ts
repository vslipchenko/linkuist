import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {DialogService} from '~app/shared/services/dialog/dialog.service';
// import {DialogTypes} from '~app/types/dialog/dialog.enums';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {ENTER} from '@angular/cdk/keycodes';
import {LinkardPrice, LinkardPrivacy} from '~app/types/linkard/linkard.enums';
import {LINKARD_TAG_LETTER_REGEXP} from '~app/constants/regexps';
import {Chip} from '~app/types/chips/chips.interfaces';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {LinkardService} from '~app/services/linkard/linkard.service';
import {ActivatedRoute} from '@angular/router';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {first} from 'rxjs/operators';

@UntilDestroy()
@Component({
  templateUrl: './linkards.component.html',
  styleUrls: ['./linkards.component.scss'],
})
export class LinkardsComponent implements OnInit {
  @ViewChild('addBookmarkContent') public addBookmarkContent: TemplateRef<unknown> | undefined;
  @ViewChild('addBookmarkActions') public addBookmarkActions: TemplateRef<unknown> | undefined;

  public readonly tagsSeparatorKeysCodes = [ENTER];
  public readonly tagSeparator = '-';
  public readonly tagLetterValidator = LINKARD_TAG_LETTER_REGEXP;
  public readonly tagSplitWordBy = /[-\s]/;

  public resolvedUser: ResolvedUser | undefined;
  public addBookmarkForm: FormGroup | undefined;
  public linkards: Array<unknown> = [];

  public constructor(
    private readonly dialogService: DialogService,
    private readonly linkardService: LinkardService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
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

  public ngOnInit(): void {
    this.resolvedUser = this.route.snapshot.data.user as ResolvedUser;
    this.linkardService
      .getAllByUsername(this.resolvedUser.urlUsername)
      .pipe(first())
      .subscribe(({data}) => {
        this.linkards = data.linkardsByUsername;
      });
  }

  public openAddBookmarkDialog(): void {
    this.initAddBookmarkForm();
    this.handlePrivateFieldValueChange();
    this.handlePriceFieldValueChange();

    this.dialogService.open({
      panelClass: 'dialog-small',
      data: {
        title: 'Add linkard',
        form: this.addBookmarkForm,
        contentTemplateRef: this.addBookmarkContent,
        actionsTemplateRef: this.addBookmarkActions,
        // statusChanges$: this.addBookmarkForm?.statusChanges,
      },
    });
  }

  public addBookmark(): void {
    this.addBookmarkForm?.markAllAsTouched();
    if (this.addBookmarkForm?.valid) {
      this.dialogService.close();
      console.log('Add linkard value ', this.addBookmarkForm.value);
      const tags = this.tagsField?.value.map((tag: any) => tag.value); // Array<string>
      tags[0] = tags[0] ? LinkardPrivacy.PRIVATE : LinkardPrivacy.PUBLIC; // simplify first element in order to match [String!]! constraint
      tags[1] = tags[1] ? LinkardPrice.PAID : LinkardPrice.FREE; // simplify first element in order to match [String!]! constraint
      // debugger;
      // return;
      this.linkardService
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
      link: [null, [Validators.required.bind(this), LinkardsComponent.linkValidator.bind(this)]],
      // title: [null],
      // image: [null],
      // icon: [null],
      note: [null],
      isPrivate: [false],
      isPaid: [false],
      tags: [
        [
          {
            text: LinkardPrivacy.PUBLIC,
            isSelected: true,
            isRemovable: false,
            color: 'accent',
          } as Chip,
          {
            text: LinkardPrice.FREE,
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
        tags[0].text = LinkardPrivacy.PRIVATE;
        // reset and disable price field & avoid valueChange trigger
        tags[1].text = LinkardPrice.FREE;
        this.priceField?.setValue(false, {emitEvent: false});
        this.priceField?.disable({emitEvent: false});
      } else {
        tags[0].text = LinkardPrivacy.PUBLIC;
        // enable price field & avoid valueChange trigger
        this.priceField?.enable({emitEvent: false});
      }
      tags[0].text = isPrivate ? LinkardPrivacy.PRIVATE : LinkardPrivacy.PUBLIC;

      this.tagsField?.setValue(tags);
    });
  }

  private handlePriceFieldValueChange(): void {
    this.priceField?.valueChanges.pipe(untilDestroyed(this)).subscribe((isPaid: boolean) => {
      const tags = this.tagsField?.value;
      tags[1].text = isPaid ? LinkardPrice.PAID : LinkardPrice.FREE;

      this.tagsField?.setValue(tags);
    });
  }

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
}
