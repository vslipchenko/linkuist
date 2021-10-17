import {
  ChangeDetectionStrategy,
  // ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {NavigationMainActionType} from '~app/shared/types/navigation/navigation.enums';
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
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
// import {LinkardService} from '~app/services/linkard/linkard.service';
// import {ActivatedRoute} from '@angular/router';
// import {ResolvedUser} from '~app/types/user/user.interfaces';
import {UserRole} from '~app/types/user/user.enums';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
// import {
//   LinkardsByUserIdQueryResult,
//   // LinkardsByUsernameQueryResult,
// } from '~app/types/linkard/linkard.interfaces';
// import {getId} from '~app/utilities/unique';
// import {ApolloQueryResult} from '@apollo/client/core/types';
import {Chip} from '~app/shared/types/chips/chips.interfaces';
// import {ResolvedUserService} from '~app/services/resolved-user/resolved-user.service';
// import {ResolvedUser} from '~app/types/user/user.interfaces';
import {DialogRef} from '~app/shared/types/dialog/dialog.interfaces';
import {LinkardsState} from '~app/modules/linkards/store';
import {Store} from '@ng-estate/store';
import {LinkardsActions} from '~app/modules/linkards/store/linkards.actions';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {AppSelectors} from '~app/store/app.selectors';
import {Observable} from 'rxjs';
import {LinkardsSelectors} from '~app/modules/linkards/store/linkards.selectors';
import {Linkard} from '~app/types/linkard/linkard.interfaces';

@UntilDestroy()
@Component({
  templateUrl: './linkards.component.html',
  styleUrls: ['./linkards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkardsComponent implements OnInit {
  @ViewChild('addBookmarkContent', {static: true}) public addBookmarkContent:
    | TemplateRef<unknown>
    | undefined;
  @ViewChild('addBookmarkActions', {static: true}) public addBookmarkActions:
    | TemplateRef<unknown>
    | undefined;

  public readonly tagsSeparatorKeysCodes = [ENTER];
  public readonly tagSeparator = '-';
  public readonly tagLetterValidator = LINKARD_TAG_LETTER_REGEXP;
  public readonly tagSplitWordBy = /[-\s]/;

  // public resolvedUser: ResolvedUser = {
  //   id: '',
  //   role: UserRole.VIEWER,
  //   urlUsername: '',
  //   // relativePaths: []
  // };
  public addBookmarkForm: FormGroup | undefined;
  public resolvedUser!: ResolvedUser;
  // public linkards: Array<unknown> = []; // TODO type
  public linkards$: Observable<Array<Linkard>>;
  private addLinkardDialogRef: DialogRef | undefined;

  public constructor(
    private readonly store: Store<LinkardsState>,
    // private readonly changeDetector: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    // private readonly linkardService: LinkardService,
    private readonly formBuilder: FormBuilder,
    // private readonly route: ActivatedRoute,
    private readonly authenticationService: AuthenticationService, // private readonly test: BrowserWindowRe // private test: WindowRef // private readonly resolvedUserService: ResolvedUserService,
  ) {
    // this.resolvedUser = this.route.snapshot.data.user as ResolvedUser;
    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });

    this.linkards$ = this.store.select$(LinkardsSelectors.getLinkards);
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

  public ngOnInit(): void {
    // IF this.resolvedUser.role === Owner -> getUserById, else by username
    // const getAllLinkards =
    //   this.resolvedUser.role === UserRole.User
    //     ? this.linkardService.getAllByUserId(
    //         this.authenticationService.accessTokenData?.userId as string,
    //       )
    //     : this.linkardService.getAllByUsername(this.resolvedUser.urlUsername);
    this.loadLinkards();

    this.initAddBookmarkForm();
    this.handlePrivateFieldValueChange();
    this.handlePriceFieldValueChange();
    // getAllLinkards
    //   .pipe(first(), untilDestroyed(this))
    //   .subscribe(({data}: {data: LinkardsByUserIdQueryResult | LinkardsByUsernameQueryResult}) => {
    //     // this.linkards = data.linkardsByUserId || data.linkardsByUsername;
    //   });
  }

  public openAddBookmarkDialog(): void {
    this.addLinkardDialogRef = this.dialogService.open({
      panelClass: 'linkard-dialog',
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
      this.addLinkardDialogRef!.close();
      console.log('Add linkard value ', this.addBookmarkForm.value);
      const tags = this.tagsField?.value.map((tag: any) => ({text: tag.text})); // Array<string>
      console.log('tags ', tags);
      //tags[0] = tags[0] ? LinkardPrivacy.PRIVATE : LinkardPrivacy.PUBLIC; // simplify first element in order to match [String!]! constraint
      //tags[1] = tags[1] ? LinkardPrice.PAID : LinkardPrice.FREE; // simplify first element in order to match [String!]! constraint
      // debugger;
      // return;
      this.store
        .dispatch$(LinkardsActions.createLinkard, {
          ...this.addBookmarkForm.value,
          tags,
        })
        .pipe(untilDestroyed(this))
        .subscribe();
      // this.linkardService
      //   .create({
      //     // createdAt: getId(),
      //     ...this.addBookmarkForm.value,
      //     tags,
      //   })
      //   .pipe(untilDestroyed(this))
      //   .subscribe();
    }
  }

  private loadLinkards(): void {
    // TODO: add possibility of lazy loading
    this.store
      .dispatch$(LinkardsActions.loadLinkards, {resolvedUserId: this.resolvedUser.id})
      .pipe(untilDestroyed(this))
      .subscribe();

    // this.linkardService
    //   .getAllByUserId(this.resolvedUser.id)
    //   .pipe(untilDestroyed(this))
    //   .subscribe(({data}: ApolloQueryResult<LinkardsByUserIdQueryResult>) => {
    //     this.linkards = data.linkardsByUserId;
    //     // this.changeDetector.detectChanges();
    //   });

    // return;
    // }

    // this.linkardService
    //   .getAllByUsername(this.resolvedUserService.user.urlUsername)
    //   .pipe(untilDestroyed(this))
    //   .subscribe(({data}: ApolloQueryResult<LinkardsByUsernameQueryResult>) => {
    //     this.linkards = data.linkardsByUsername;
    //     this.changeDetector.detectChanges();
    //   });
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

  // public get areActionsVisible(): boolean {
  //   return this.isUser;
  // }

  // public get resolvedUser(): ResolvedUser {
  //   return this.resolvedUserService.user;
  // }

  public get isViewer(): boolean {
    return this.resolvedUser.role === UserRole.VIEWER;
  }

  public get isUser(): boolean {
    return this.resolvedUser.role === UserRole.USER;
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
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
