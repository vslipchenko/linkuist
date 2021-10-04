import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UserRole} from '~app/types/user/user.enums';
import {PostService} from '~app/services/post/post.service';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {
  PostCreateMutationResult,
  PostDeleteCountMutationResult,
  PostsByUserIdQueryResult,
} from '~app/types/post/post.interfaces';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {endWith, finalize, map, startWith, takeWhile} from 'rxjs/operators';
import {SortOrder, ElapsedTimeMeasure} from '~app/types/shared/shared.enums';
import {POST_FETCH_LIMIT} from '~app/constants/post';
import {DateService} from '~app/shared/services/date/date.service';
import {
  determineElapsedTimeMeasure,
  hasLessMillisecondsThanDay,
  hasMoreMillisecondsThanDay,
  millisecondsToHours,
  millisecondsToMinutes,
} from '~app/utilities/date';
import {TranslateService} from '@ngx-translate/core';
// import {MONTH_NAMES} from '~app/constants/date';
import {Observable} from 'rxjs';
import {ResolvedUserService} from '~app/services/resolved-user/resolved-user.service';
import {ProfileService} from '~app/services/profile/profile.service';
import {PostCommentService} from '~app/services/post-comment/post-comment.service';
import {PostCommentCreateMutationResult} from '~app/types/post-comment/post-comment.interfaces';
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
  @Input() public avatarUrl = '';

  // public resolvedUser: ResolvedUser = {
  //   role: UserRole.GUEST,
  //   urlUsername: '',
  //   // relativePaths: [],
  // };

  // public readonly UserRole = UserRole;
  public posts: Array<any> = [];
  public profileTeasers: {[userId: string]: {username: string; avatarUrl: string}} = {};

  public constructor(
    // @Inject(WINDOW) private readonly window: Window,

    private readonly resolvedUserService: ResolvedUserService,
    private readonly postService: PostService,
    private readonly authenticationService: AuthenticationService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly progressBarService: ProgressBarService,
    private readonly dateService: DateService,
    private readonly translateService: TranslateService,
    private readonly profileService: ProfileService,
    private readonly postCommentService: PostCommentService,
  ) {}

  public ngOnInit(): void {
    this.bindProfileChange();
    this.fetchPosts();
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

  public postsTrackBy(_: number, post: any): string {
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
    this.progressBarService.show();
    this.postService
      .create({
        // createdAt: getId(),
        text,
      })
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.progressBarService.hide();
        }),
      )
      .subscribe(({data}: FetchResult<PostCreateMutationResult>) => {
        const {userId, text, isRepost, createdAt} = data!.createPost;
        // Assume userId is equal to if of current user
        this.profileTeasers[userId] = {
          avatarUrl: this.avatarUrl,
          username: this.resolvedUserService.user.urlUsername,
        };

        const newPost = {
          userId,
          text,
          isRepost,
          createdAt,
          millisecondsElapsed: this.dateService.serverUtcTimestamp - createdAt,
          date: this.getPostFullDate(createdAt),
          // userId: this.authenticationService.accessTokenData?.userId,
        } as any;

        newPost.timeElapsedAfterCreation$ = this.getTimeElapsedAfterCreation$(newPost, newPost);

        this.posts.unshift(newPost);

        this.changeDetector.detectChanges();
      });
  }

  public handlePostDelete(_id: string): void {
    this.progressBarService.show();
    // console.log(_id, this.post);
    this.postService
      .deleteById(_id)
      .pipe(
        untilDestroyed(this),
        finalize(() => this.progressBarService.hide()),
      )
      .subscribe(({data}: FetchResult<PostDeleteCountMutationResult>) => {
        if (!data?.deletePost) return;

        this.posts.splice(
          this.posts.findIndex((post) => post._id === _id),
          1,
        );
      });
  }

  public handleAddPostComment(payload: {body: string; postId: string}): void {
    this.progressBarService.show();
    console.log(payload);
    this.postCommentService
      .create(payload)
      .pipe(
        untilDestroyed(this),
        finalize(() => this.progressBarService.hide()),
      )
      .subscribe(({data}: FetchResult<PostCommentCreateMutationResult>) => {
        console.log(data);
      });
  }

  private bindProfileChange(): void {
    this.profileService.userProfile$.pipe(untilDestroyed(this)).subscribe((profile) => {
      if (!this.profileTeasers[this.resolvedUserService.user.id]) return;

      this.profileTeasers = {
        ...this.profileTeasers,
        [this.resolvedUserService.user.id]: {
          username: this.profileTeasers[this.resolvedUserService.user.id].username,
          avatarUrl: profile.avatarUrl,
        },
      };
    });
  }

  private fetchPosts(offset = 0): void {
    this.progressBarService.show();

    this.postService
      .getAllByUserId(this.resolvedUserService.user.id, {
        order: SortOrder.DESCENDING,
        offset,
        limit: POST_FETCH_LIMIT,
      })
      .pipe(
        finalize(() => this.progressBarService.hide()),
        untilDestroyed(this),
      )
      .subscribe(({data}: ApolloQueryResult<PostsByUserIdQueryResult>) => {
        const posts = data.postsByUserId;

        posts.userProfileTeasers.forEach((teaser) => {
          this.profileTeasers[teaser._id] = {
            // Where profile/teaser _id is equal to user id
            avatarUrl: teaser.profile?.avatarUrl,
            username: teaser.username,
          };
        });

        this.posts = posts.posts.data.map((post) => {
          const newPost = {...post} as any;

          newPost.millisecondsElapsed = this.dateService.serverUtcTimestamp - post.createdAt;
          newPost.date = this.getPostFullDate(post.createdAt);

          if (hasLessMillisecondsThanDay(this.dateService.serverUtcTimestamp - post.createdAt)) {
            newPost.timeElapsedAfterCreation$ = this.getTimeElapsedAfterCreation$(post, newPost);

            return newPost;
          }

          newPost.timeElapsedAfterCreation = this.getPostShortDate(
            post.createdAt,
            this.dateService.serverUtcTimestamp,
          );

          return newPost;
        });
        console.debug(this.posts);
        // this.posts.forEach((post) => post.userId)
        this.changeDetector.detectChanges();
      });
  }

  // !!! MUTATES POST ITEM [NOT PURE]
  private getTimeElapsedAfterCreation$(originalPost: any, newPost: any): Observable<string> {
    return this.dateService.serverUtcTimestampTick$ // Update UI each minute
      .pipe(
        startWith(this.dateService.serverUtcTimestamp),
        takeWhile(
          (serverUtcTimestamp: number) =>
            !hasMoreMillisecondsThanDay(serverUtcTimestamp - originalPost.createdAt, true), // Use inclusive in order to state the actual date instead of 1d
        ),
        endWith(this.getPostShortDate(originalPost.createdAt, this.dateService.serverUtcTimestamp)), // Emitted each time whenever subscription to completed observable happens
        map((value) => {
          // At this point this.dateService.serverUtcTimestamp has relevant value until, this part of the code executed with ~1m lag
          const millisecondsElapsed = this.dateService.serverUtcTimestamp - originalPost.createdAt;

          if (typeof value === 'string') {
            // Let change detection spot it's time change for the last time
            newPost.millisecondsElapsed = millisecondsElapsed;
            // Nullify observable
            newPost.timeElapsedAfterCreation$ = null;
            // MUTATES; use timeElapsedAfterCreation for the rest of a time
            return (newPost.timeElapsedAfterCreation = value); // endWith emitted value
          }

          // const millisecondsElapsed = value - originalPost.createdAt;
          // MUTATES
          newPost.millisecondsElapsed = millisecondsElapsed;

          const measure = determineElapsedTimeMeasure(millisecondsElapsed);

          switch (measure) {
            case ElapsedTimeMeasure.SECOND:
              return this.translateService.instant('DATE.JUST_NOW');
            case ElapsedTimeMeasure.MINUTE:
              return this.translateService.instant('DATE.MINUTES_PASSED', {
                number: millisecondsToMinutes(millisecondsElapsed),
              });
            case ElapsedTimeMeasure.HOUR:
              return this.translateService.instant('DATE.HOURS_PASSED', {
                number: millisecondsToHours(millisecondsElapsed),
              });
          }
        }),
        // tap(() => this.changeDetector.detectChanges()),
      );
  }

  private getPostShortDate(createdAt: number, serverUtcTimestamp: number): string {
    const createdAtDate = new Date(createdAt);
    const createdAtYear = createdAtDate.getFullYear();
    const haveYearDifference = new Date(serverUtcTimestamp).getFullYear() - createdAtYear > 0;
    const createdAtMonth = this.translateService.instant(
      `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
    ) as string;

    return `${createdAtDate.getDate()} ${createdAtMonth} ${
      haveYearDifference ? createdAtYear : ''
    }`.trim();
  }

  private getPostFullDate(createdAt: number): string {
    const createdAtDate = new Date(createdAt);
    const createdAtYear = createdAtDate.getFullYear();
    const createdAtDay = this.translateService.instant(
      `DATE.CREATED_AT_DAY.${createdAtDate.getDay()}`,
    ) as string;
    const createdAtMonth = this.translateService.instant(
      `DATE.CREATED_AT_MONTH.${createdAtDate.getMonth()}`,
    ) as string;
    const createdAtPhrase = this.translateService.instant('DATE.CREATED_AT') as string;
    const createdAtHours =
      createdAtDate.getHours() < 10 ? `0${createdAtDate.getHours()}` : createdAtDate.getHours();
    const createdAtMinutes =
      createdAtDate.getMinutes() < 10
        ? `0${createdAtDate.getMinutes()}`
        : createdAtDate.getMinutes();

    return `${createdAtDay}, ${createdAtDate.getDate()} ${createdAtMonth} ${createdAtYear} ${createdAtPhrase} ${createdAtHours}:${createdAtMinutes}`;
  }

  public get hasUserRole(): boolean {
    return this.resolvedUserService.user.role === UserRole.USER;
  }
}
