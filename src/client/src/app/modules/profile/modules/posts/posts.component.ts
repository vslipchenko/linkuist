import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserRole} from '~app/types/user/user.enums';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {UIPost} from '~app/types/post/post.interfaces';
// import {MONTH_NAMES} from '~app/constants/date';
import {Observable} from 'rxjs';
import {PostCommentCreatePayload} from '~app/types/post-comment/post-comment.interfaces';
import {AppSelectors} from '~app/store/app.selectors';
import {Store} from '@ng-estate/store';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {ProfileSelectors} from '~app/modules/profile/store/profile.selectors';
// import {WINDOW} from '~app/tokens/window';
// import {BehaviorSubject, of} from 'rxjs';

// export const POST_DATE_UPDATE_PERIOD = 1000 * 60;

@UntilDestroy()
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit {
  // @Input() public readonly resolvedUser: ResolvedUser = {
  //   role: UserRole.VIEWER,
  //   urlUsername: '',
  //   // relativePaths: [],
  // };
  // @Input() public username = '';

  // public resolvedUser: ResolvedUser = {
  //   role: UserRole.GUEST,
  //   urlUsername: '',
  //   // relativePaths: [],
  // };

  // public readonly UserRole = UserRole;
  // public posts: Array<any> = [];
  public posts$: Observable<Array<UIPost>>;
  public postCount$: Observable<number>;
  public postTotalCount$: Observable<number>;
  public isLoadingPosts$: Observable<boolean>;
  // public profileTeasers: {[userId: string]: {username: string; avatarUrl: string}} = {};
  private resolvedUser!: ResolvedUser;

  public constructor(
    // @Inject(WINDOW) private readonly window: Window,
    private readonly store: Store<PostsState>,
  ) {
    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });

    this.posts$ = this.store.select$(PostsSelectors.getPosts);
    this.postCount$ = this.store.select$(PostsSelectors.getPostCount);
    this.postTotalCount$ = this.store.select$(PostsSelectors.getPostTotalCount);
    this.isLoadingPosts$ = this.store.select$(PostsSelectors.getIsLoadingPosts);
  }

  public ngOnInit(): void {
    // this.bindProfileChange();
    this.loadPosts();
  }

  // public ngOnChanges(changes: SimpleChanges): void {
  //   console.log(changes);
  //   if (changes.avatarUrl) {
  //     console.log('DETECTED');
  //     debugger;
  //     if (this.profileTeasers[this.resolvedUserService.user.id]) {
  //       this.profileTeasers[this.resolvedUserService.user.id].avatarUrl =
  //         changes.avatarUrl.currentValue;
  //       this.changeDetector.detectChanges();
  //     }
  //   }
  // }

  public postsTrackBy(_: number, post: UIPost): string {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    // console.debug(post.millisecondsElapsed);
    //console.log('CHANGE DET', post._id);
    //return post._id + post.millisecondsElapsed; // Hour frequency items gets re-rendered as well
    return post._id; // Hour frequency items gets re-rendered as well
  }

  // ngDoCheck() {
  //   console.log('DO CHECK');
  // }

  public createPost(text: string): void {
    // this.progressBarService.show();
    this.store.dispatch$(PostsActions.createPost, text).pipe(untilDestroyed(this)).subscribe();
  }

  public handlePostDelete(_id: string): void {
    // this.progressBarService.show();
    // console.log(_id, this.post);
    this.store.dispatch$(PostsActions.deletePost, _id).pipe(untilDestroyed(this)).subscribe();
    // this.postService
    //   .deleteById(_id)
    //   .pipe(
    //     untilDestroyed(this),
    //     // finalize(() => this.progressBarService.hide()),
    //   )
    //   .subscribe(({data}: FetchResult<PostDeleteCountMutationResult>) => {
    //     if (!data?.deletePost) return;
    //
    //     this.posts.splice(
    //       this.posts.findIndex((post) => post._id === _id),
    //       1,
    //     );
    //   });
  }

  public handleAddPostComment(payload: PostCommentCreatePayload): void {
    // this.progressBarService.show();
    console.log(payload);
    this.store
      .dispatch$(PostsActions.createPostComment, payload)
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
    // this.postCommentService
    //   .create(payload)
    //   .pipe(
    //     untilDestroyed(this),
    //     finalize(() => this.progressBarService.hide()),
    //   )
    //   .subscribe(({data}: FetchResult<PostCommentCreateMutationResult>) => {
    //     console.log(data);
    //   });
  }

  public showMorePosts(): void {
    const offset = this.store.select<number>(PostsSelectors.getPostCount);

    this.loadPosts(offset);
  }

  // private bindProfileChange(): void {
  //   this.profileService.userProfile$.pipe(untilDestroyed(this)).subscribe((_profile) => {
  //     if (!this.profileTeasers[this.resolvedUserId]) return;
  //
  //     this.profileTeasers = {
  //       ...this.profileTeasers,
  //       [this.resolvedUserId]: {
  //         username: this.profileTeasers[this.resolvedUserId].username,
  //         avatarUrl: _profile.avatarUrl,
  //       },
  //     };
  //   });
  // }

  private loadPosts(offset = 0): void {
    // Profile teasers is empty at this point as current user profile is not fetched yet,
    // use resoled user id as a prediction
    let skipProfileTeaserIds = Object.keys(this.store.select(ProfileSelectors.getProfileTeasers));

    if (!skipProfileTeaserIds.length) skipProfileTeaserIds = [this.resolvedUser.id];

    this.store
      .dispatch$(PostsActions.loadPosts, {
        resolvedUserId: this.resolvedUser.id,
        skipProfileTeaserIds,
        offset,
      })
      .pipe(untilDestroyed(this))
      .subscribe();

    // this.postService
    //   .getAllByUserId(this.resolvedUserId, {
    //     order: SortOrder.DESCENDING,
    //     offset,
    //     limit: POST_FETCH_LIMIT,
    //   })
    //   .pipe(
    //     // finalize(() => this.progressBarService.hide()),
    //     untilDestroyed(this),
    //   )
    //   .subscribe(({data}: ApolloQueryResult<PostsByUserIdQueryResult>) => {
    //     const posts = data.postsByUserId;
    //
    //     posts.userProfileTeasers.forEach((teaser) => {
    //       this.profileTeasers[teaser._id] = {
    //         // Where _profile/teaser _id is equal to user id
    //         avatarUrl: teaser._profile?.avatarUrl,
    //         username: teaser.username,
    //       };
    //     });
    //
    //     this.posts = posts.posts.data.map((post) => {
    //       const newPost = {...post} as any;
    //
    //       newPost.millisecondsElapsed = this.dateService.serverUtcTimestamp - post.createdAt;
    //       newPost.date = this.getPostFullDate(post.createdAt);
    //
    //       if (hasLessMillisecondsThanDay(this.dateService.serverUtcTimestamp - post.createdAt)) {
    //         newPost.timeElapsedAfterCreation$ = this.getTimeElapsedAfterCreation$(post, newPost);
    //
    //         return newPost;
    //       }
    //
    //       newPost.timeElapsedAfterCreation = this.getPostShortDate(
    //         post.createdAt,
    //         this.dateService.serverUtcTimestamp,
    //       );
    //
    //       return newPost;
    //     });
    //     console.debug(this.posts);
    //     // this.posts.forEach((post) => post.userId)
    //     this.changeDetector.detectChanges();
    //   });
  }

  // !!! MUTATES POST ITEM [NOT PURE]
  // private getTimeElapsedAfterCreation$(originalPost: any, newPost: any): Observable<string> {
  //   return this.dateService.serverUtcTimestampTick$ // Update UI each minute
  //     .pipe(
  //       startWith(this.dateService.serverUtcTimestamp),
  //       takeWhile(
  //         (serverUtcTimestamp: number) =>
  //           !hasMoreMillisecondsThanDay(serverUtcTimestamp - originalPost.createdAt, true), // Use inclusive in order to state the actual date instead of 1d
  //       ),
  //       endWith(this.getPostShortDate(originalPost.createdAt, this.dateService.serverUtcTimestamp)), // Emitted each time whenever subscription to completed observable happens
  //       map((value) => {
  //         // At this point this.dateService.serverUtcTimestamp has relevant value until, this part of the code executed with ~1m lag
  //         const millisecondsElapsed = this.dateService.serverUtcTimestamp - originalPost.createdAt;
  //
  //         if (typeof value === 'string') {
  //           // Let change detection spot it's time change for the last time
  //           newPost.millisecondsElapsed = millisecondsElapsed;
  //           // Nullify observable
  //           newPost.timeElapsedAfterCreation$ = null;
  //           // MUTATES; use timeElapsedAfterCreation for the rest of a time
  //           return (newPost.timeElapsedAfterCreation = value); // endWith emitted value
  //         }
  //
  //         // const millisecondsElapsed = value - originalPost.createdAt;
  //         // MUTATES
  //         newPost.millisecondsElapsed = millisecondsElapsed;
  //
  //         const measure = determineElapsedTimeMeasure(millisecondsElapsed);
  //
  //         switch (measure) {
  //           case ElapsedTimeMeasure.SECOND:
  //             return this.translateService.instant('DATE.JUST_NOW');
  //           case ElapsedTimeMeasure.MINUTE:
  //             return this.translateService.instant('DATE.MINUTES_PASSED', {
  //               number: millisecondsToMinutes(millisecondsElapsed),
  //             });
  //           case ElapsedTimeMeasure.HOUR:
  //             return this.translateService.instant('DATE.HOURS_PASSED', {
  //               number: millisecondsToHours(millisecondsElapsed),
  //             });
  //         }
  //       }),
  //       // tap(() => this.changeDetector.detectChanges()),
  //     );
  // }

  // private getPostShortDate(createdAt: number, serverUtcTimestamp: number): string {
  //   const createdAtDate = new Date(createdAt);
  //   const createdAtYear = createdAtDate.getFullYear();
  //   const haveYearDifference = new Date(serverUtcTimestamp).getFullYear() - createdAtYear > 0;
  //   const createdAtMonth = this.translateService.instant(
  //     `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
  //   ) as string;
  //
  //   return `${createdAtDate.getDate()} ${createdAtMonth} ${
  //     haveYearDifference ? createdAtYear : ''
  //   }`.trim();
  // }
  //
  // private getPostFullDate(createdAt: number): string {
  //   const createdAtDate = new Date(createdAt);
  //   const createdAtYear = createdAtDate.getFullYear();
  //   const createdAtDay = this.translateService.instant(
  //     `DATE.CREATED_AT_DAY.${createdAtDate.getDay()}`,
  //   ) as string;
  //   const createdAtMonth = this.translateService.instant(
  //     `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
  //   ) as string;
  //   const createdAtPhrase = this.translateService.instant('DATE.CREATED_AT') as string;
  //   const createdAtHours =
  //     createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
  //   const createdAtMinutes =
  //     createdAtDate.getMinutes() < 10
  //       ? `0${createdAtDate.getMinutes()}`
  //       : createdAtDate.getMinutes();
  //
  //   return `${createdAtDay}, ${createdAtDate.getDate()} ${createdAtMonth} ${createdAtYear} ${createdAtPhrase} ${createdAtHours}:${createdAtMinutes}`;
  // }

  public get hasUserRole(): boolean {
    return this.resolvedUser.role === UserRole.USER;
  }
}
