import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {UserRole} from '~app/types/user/user.enums';
import {PostService} from '~app/services/post/post.service';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {
  PostCreateMutationResult,
  PostsByUserIdQueryResult,
  PostsByUsernameQueryResult,
} from '~app/types/post/post.interfaces';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {finalize} from 'rxjs/operators';
import {SortOrder} from '~app/types/shared/shared.enums';

@UntilDestroy()
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit {
  @Input() public readonly resolvedUser: ResolvedUser = {
    role: UserRole.VIEWER,
    urlUsername: '',
    relativePaths: [],
  };
  public readonly UserRole = UserRole;
  public posts: Array<unknown> = [];
  private readonly POST_FETCH_LIMIT = 20;

  public constructor(
    private readonly postService: PostService,
    private readonly authenticationService: AuthenticationService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly progressBarService: ProgressBarService,
  ) {}

  public ngOnInit(): void {
    this.fetchPosts();
  }

  public postsTrackBy(index: number, post: any): string {
    return post._id;
  }

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
        this.posts.unshift(data!.createPost);
        this.changeDetector.detectChanges();
      });
  }

  private fetchPosts(offset = 0): void {
    this.progressBarService.show();

    if (this.resolvedUser.role === UserRole.USER) {
      this.postService
        .getAllByUserId(this.authenticationService.accessTokenData!.userId, {
          order: SortOrder.DESCENDING,
          offset,
          limit: this.POST_FETCH_LIMIT,
        })
        .pipe(
          finalize(() => this.progressBarService.hide()),
          untilDestroyed(this),
        )
        .subscribe(({data}: ApolloQueryResult<PostsByUserIdQueryResult>) => {
          this.posts = data.postsByUserId.data.slice();
          this.changeDetector.detectChanges();
        });

      return;
    }

    this.postService
      .getAllByUsername(this.resolvedUser.urlUsername, {
        order: SortOrder.DESCENDING,
        offset,
        limit: this.POST_FETCH_LIMIT,
      })
      .pipe(
        finalize(() => this.progressBarService.hide()),
        untilDestroyed(this),
      )
      .subscribe(({data}: ApolloQueryResult<PostsByUsernameQueryResult>) => {
        this.posts = data.postsByUsername.data.slice();
        this.changeDetector.detectChanges();
      });
  }
}
