import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {UserRole} from '~app/types/user/user.enums';
import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {POST_COMMENT_MAX_LENGTH} from '~app/constants/post';
import {UIPost} from '~app/types/post/post.interfaces';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {Store} from '@ng-estate/store';
import {Observable, of} from 'rxjs';
import {ProfileSelectors} from '~app/modules/profile/store/profile.selectors';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {AppSelectors} from '~app/store/app.selectors';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {PostComment} from '~app/types/post-comment/post-comment.interfaces';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';

@UntilDestroy()
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  @Input() public readonly post!: UIPost;

  @Output() public readonly deletePost = new EventEmitter<void>();
  @Output() public readonly addComment = new EventEmitter<string>();

  public readonly profileTeasers$: Observable<ProfileTeasers>;
  // public readonly visiblePostComments$: Observable<PostsState['visiblePostComments']>;
  public readonly isLoadingPostComments$: Observable<boolean>;
  public readonly POST_COMMENT_MAX_LENGTH = POST_COMMENT_MAX_LENGTH;
  public readonly addCommentControl = new FormControl('');
  public postComments$: Observable<Array<PostComment>> = of();
  public postCommentTotalCount$: Observable<number> = of();
  public showPostComments = false;

  public resolvedUser!: ResolvedUser;

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    // private readonly postService: PostService,
    // private readonly progressBarService: ProgressBarService,
    private readonly store: Store<PostsState>,
  ) {
    this.profileTeasers$ = this.store.select$(ProfileSelectors.getProfileTeasers);
    // this.visiblePostComments$ = this.store.select$(PostsSelectors.getVisiblePostComments);
    this.isLoadingPostComments$ = this.store.select$(PostsSelectors.getIsLoadingPostComments);

    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });
  }

  public ngOnInit(): void {
    this.postComments$ = this.store.select$(PostsSelectors.getPostCommentsByPostId, this.post._id);
    this.postCommentTotalCount$ = this.store.select$(
      PostsSelectors.getPostCommentTotalCount,
      this.post._id,
    );
  }

  public postCommentsTrackBy(_: number, postComment: PostComment): string {
    return postComment._id;
  }

  public scrollTop(): void {
    // this.window.scrollTo(0, 0);
    this.document.getElementById('main')!.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public delete(): void {
    this.deletePost.emit();
  }

  public comment(value: string): void {
    this.addComment.emit(value);
  }

  public showComments(postId: string): void {
    if (!this.showPostComments) this.showPostComments = true;

    // console.log(this.store.select(PostsSelectors.getPostCommentCount, postId) ?? 0);
    // console.log(postId, this.store.select(PostsSelectors.getPostCommentCount));

    this.store
      .dispatch$(PostsActions.loadPostComments, {
        postId,
        skipProfileTeaserIds: Object.keys(this.store.select(ProfileSelectors.getProfileTeasers)),
        offset: this.store.select(PostsSelectors.getPostCommentCount, postId),
      })
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
  }

  // public isPostOwner(username: string): boolean {
  //   return this.resolvedUser.urlUsername === username;
  // }

  public get hasUserRole(): boolean {
    return this.resolvedUser.role === UserRole.USER;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('CHANGES ', changes);
  // }
  //
  // ngDoCheck(): void {
  //   console.log('CHECK ', this);
  // }
}
