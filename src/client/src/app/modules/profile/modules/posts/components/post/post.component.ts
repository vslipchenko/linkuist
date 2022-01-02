import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {UserRole} from '~app/types/user/user.enums';
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
import {
  PostCommentCreateMutationResult,
  PostCommentCreatePayload,
  UIPostComment,
} from '~app/types/post-comment/post-comment.interfaces';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {UIPostSubcomment} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {FetchResult} from '@apollo/client/core';

@UntilDestroy()
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  @Input() public readonly post!: UIPost;

  public readonly profileTeasers$: Observable<ProfileTeasers>;
  // public readonly visiblePostComments$: Observable<PostsState['visiblePostComments']>;
  public readonly isLoadingPostComments$: Observable<boolean>;
  public readonly isLoadingPostSubcomments$: Observable<boolean>;
  public readonly POST_COMMENT_MAX_LENGTH = POST_COMMENT_MAX_LENGTH;
  // public readonly addCommentControl = new FormControl('');
  public postComments$: Observable<Array<UIPostComment>> = of();
  // public postSubcomments$: Observable<Array<UIPostSubcomment>> = of();
  public postCommentTotalCount$: Observable<number> = of();
  public showPostComments = false;
  // public showPostSubcomments = false;

  public resolvedUser!: ResolvedUser;

  private recentlyAddedPostCommentIds: Array<string> = [];
  private recentlyAddedPostSubcommentIds: {[commentId: string]: Array<string>} = {};

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    // private readonly postService: PostService,
    // private readonly progressBarService: ProgressBarService,
    private readonly store: Store<PostsState>,
  ) {
    this.profileTeasers$ = this.store.select$(ProfileSelectors.getProfileTeasers);
    // this.visiblePostComments$ = this.store.select$(PostsSelectors.getVisiblePostComments);
    this.isLoadingPostComments$ = this.store.select$(PostsSelectors.getIsLoadingPostComments);
    this.isLoadingPostSubcomments$ = this.store.select$(PostsSelectors.getIsLoadingPostSubcomments);

    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });
  }

  public ngOnInit(): void {
    this.postComments$ = this.store.select$(PostsSelectors.getPostCommentsByPostId, this.post._id);
    // this.postSubcomments$ = this.store.select$(PostsSelectors.get, this.post._id);
    this.postCommentTotalCount$ = this.store.select$(
      PostsSelectors.getPostCommentTotalCount,
      this.post._id,
    );
  }

  public postCommentsTrackBy(_: number, postComment: UIPostComment): string {
    return postComment._id;
  }

  public scrollTop(): void {
    // this.window.scrollTo(0, 0);
    this.document.getElementById('main')!.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public comment(value: string): void {
    if (!this.showPostComments) this.showPostComments = true;

    // this.addComment.emit(value);
    this.handleAddPostComment(value);
  }

  public updateRecentlyAddedSubcommentIds({id, commentId}: {id: string; commentId: string}): void {
    if (!this.recentlyAddedPostSubcommentIds[commentId]) {
      this.recentlyAddedPostSubcommentIds[commentId] = [];
    }

    this.recentlyAddedPostSubcommentIds[commentId].push(id);
  }

  public showComments(postId: string, postComments: Array<UIPostComment>): void {
    if (!this.showPostComments) this.showPostComments = true;

    // console.log(this.store.select(PostsSelectors.getPostCommentCount, postId) ?? 0);
    // console.log(postId, this.store.select(PostsSelectors.getPostCommentCount));

    // const recentlyAddedPostCommentIds = postComments
    //   ? postComments
    //       .filter((postComment) => postComment.isRecentlyAdded)
    //       .map((postComment) => postComment._id)
    //   : [];

    this.store
      .dispatch$(PostsActions.loadPostComments, {
        postId,
        recentlyAddedPostCommentIds: this.recentlyAddedPostCommentIds,
        skipProfileTeaserIds: Object.keys(this.store.select(ProfileSelectors.getProfileTeasers)),
        // offset: this.store.select(PostsSelectors.getPostCommentCount, postId),
        offset: postComments?.length ?? 0,
      })
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
  }

  public hideCommentThread(postId: string): void {
    this.store.dispatch(PostsActions.removeCommentThread, postId);
    this.showPostComments = false;
    this.recentlyAddedPostCommentIds = [];
    this.recentlyAddedPostSubcommentIds = {};
  }

  public showSubcomments(commentId: string): void {
    // if (!this.showPostSubcomments) this.showPostSubcomments = true;
    if (!this.recentlyAddedPostSubcommentIds[commentId]) {
      this.recentlyAddedPostSubcommentIds[commentId] = [];
    }

    this.store
      .dispatch$(PostsActions.loadPostSubcomments, {
        commentId,
        recentlyAddedPostSubcommentIds: this.recentlyAddedPostSubcommentIds[commentId],
        skipProfileTeaserIds: Object.keys(this.store.select(ProfileSelectors.getProfileTeasers)),
        offset: this.store.select(PostsSelectors.getPostSubcommentCount, commentId),
      })
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
  }

  public hideSubcommentThread(commentId: string): void {
    // if (!this.showPostSubcomments) this.showPostSubcomments = true;
    this.store.dispatch(PostsActions.removeSubcommentThread, commentId);
    this.recentlyAddedPostSubcommentIds = {};
  }

  public handleAddPostComment(body: string): void {
    // this.progressBarService.show();
    // console.log(payload);
    this.store
      .dispatch$<FetchResult<PostCommentCreateMutationResult>>(PostsActions.createPostComment, {
        postId: this.post._id,
        body,
      } as PostCommentCreatePayload)
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.recentlyAddedPostCommentIds.push(result.data!.createPostComment._id);
      });
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

  public handlePostDelete(): void {
    // this.progressBarService.show();
    // console.log(_id, this.post);
    this.store
      .dispatch$(PostsActions.deletePost, this.post._id)
      .pipe(untilDestroyed(this))
      .subscribe();
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

  public handlePostCommentDelete(postId: string, commentId: string): void {
    this.store
      .dispatch$(PostsActions.deletePostComment, {postId, commentId})
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  // public addPostComment(value: string): void {
  //
  // }
  //
  //
  // public addPostSubcomment(value: string): void {
  //
  // }

  // public isPostOwner(username: string): boolean {
  //   return this.resolvedUser.urlUsername === username;
  // }

  // public isButtonRenderable(condition1, condition2): boolean {
  //   return condition1 || condition2;
  // }

  public getPostSubcomments$(commentId: string): Observable<Array<UIPostSubcomment>> {
    return this.store.select$(PostsSelectors.getPostSubcommentsByCommentId, commentId);
  }

  public getPostSubcommentTotalCount$(commentId: string): Observable<number> {
    return this.store.select$(PostsSelectors.getPostSubcommentTotalCount, commentId);
  }

  public get hasUserRole(): boolean {
    // console.log(this.resolvedUser);
    // If profile owner
    return this.resolvedUser.role === UserRole.USER; // TODO or post author
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('CHANGES ', changes);
  // }
  //
  // ngDoCheck(): void {
  //   console.log('CHECK ', this);
  // }
}
