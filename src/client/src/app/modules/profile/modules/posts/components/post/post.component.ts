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
import {UIPostReply} from '~app/types/post-reply/post-reply.interfaces';
import {FetchResult} from '@apollo/client/core';
import {State} from '~app/types/shared/shared.enums';

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
  public readonly isLoadingPostReplies$: Observable<boolean>;
  public readonly POST_COMMENT_MAX_LENGTH = POST_COMMENT_MAX_LENGTH;
  // public readonly addCommentControl = new FormControl('');
  public postComments$: Observable<Array<UIPostComment>> = of();
  // public postReplyTotalCount$: Observable<Array<UIPostComment>> = of();
  public postCommentReplyTotalCount$: Observable<number> = of();
  // public postReplies$: Observable<Array<UIPostReply>> = of();
  public postCommentTotalCount$: Observable<number> = of();
  public showPostComments = false;
  // public showPostReplies = false;

  public resolvedUser!: ResolvedUser;

  private recentlyAddedPostCommentIds: Array<string> = [];
  private recentlyAddedPostReplyIds: {[commentId: string]: Array<string>} = {};

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    // private readonly postService: PostService,
    // private readonly progressBarService: ProgressBarService,
    private readonly store: Store<PostsState>,
  ) {
    this.profileTeasers$ = this.store.select$(ProfileSelectors.getProfileTeasers);
    // this.visiblePostComments$ = this.store.select$(PostsSelectors.getVisiblePostComments);
    this.isLoadingPostComments$ = this.store.select$(PostsSelectors.getIsLoadingPostComments);
    this.isLoadingPostReplies$ = this.store.select$(PostsSelectors.getIsLoadingPostReplies);

    this.store
      .select$<ResolvedUser>(AppSelectors.getResolvedUser)
      .pipe(untilDestroyed(this))
      .subscribe((resolvedUser) => {
        this.resolvedUser = resolvedUser;
      });
  }

  public ngOnInit(): void {
    this.postComments$ = this.store.select$(PostsSelectors.getPostCommentsByPostId, this.post._id);
    // this.postReplyTotalCount$ = this.store.select$(
    //   PostsSelectors.getPostRepliesTotalCount,
    // );
    // this.postCommentReplyTotalCount$ = this.store
    //   .select$<number>(PostsSelectors.getPostCommentReplyTotalCount, this.post._id)
    //   .pipe(
    //     // skip(1),
    //     // startWith(
    //     //   this.store.select(PostsSelectors.getPostCommentReplyTotalCount2, this.post._id),
    //     // ),
    //     switchMap(() => {
    //       return iif(() => true, of(1), of(2));
    //     }),
    //     tap(console.log),
    //   );

    this.postCommentReplyTotalCount$ = this.store.select$(
      PostsSelectors.getPostCommentReplyTotalCount,
      this.post._id,
    );
    // this.postReplies$ = this.store.select$(PostsSelectors.get, this.post._id);
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

  public updateRecentlyAddedReplyIds({id, commentId}: {id: string; commentId: string}): void {
    if (!this.recentlyAddedPostReplyIds[commentId]) {
      this.recentlyAddedPostReplyIds[commentId] = [];
    }

    this.recentlyAddedPostReplyIds[commentId].push(id);
  }

  public showComments(postComments: Array<UIPostComment>, postId: string): void {
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
    // this.store.dispatch(PostsActions.setPostCmmentReplyTotalCount, {
    //   postId,
    //   commentReplyTotalCount: this.store.select(
    //     PostsSelectors.getPostCommentReplyTotalCount2,
    //     this.post._id,
    //   ),
    // });
    this.store.dispatch(PostsActions.removeCommentThread, postId);
    this.showPostComments = false;
    this.recentlyAddedPostCommentIds = [];
    this.recentlyAddedPostReplyIds = {};
  }

  public showReplies(commentId: string): void {
    // if (!this.showPostReplies) this.showPostReplies = true;
    if (!this.recentlyAddedPostReplyIds[commentId]) {
      this.recentlyAddedPostReplyIds[commentId] = [];
    }

    this.store
      .dispatch$(PostsActions.loadPostReplies, {
        commentId,
        recentlyAddedPostReplyIds: this.recentlyAddedPostReplyIds[commentId],
        skipProfileTeaserIds: Object.keys(this.store.select(ProfileSelectors.getProfileTeasers)),
        offset: this.store.select(PostsSelectors.getPostReplyCount, commentId),
      })
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
  }

  public hideReplyThread(commentId: string): void {
    // if (!this.showPostReplies) this.showPostReplies = true;
    this.store.dispatch(PostsActions.removeReplyThread, commentId);
    this.recentlyAddedPostReplyIds = {};
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

  public handlePostLike(currentState: State): void {
    const nextState = currentState === State.YES ? State.NONE : State.YES;

    this.likePost(nextState);
  }

  public handlePostDislike(currentState: State): void {
    const nextState = currentState === State.NO ? State.NONE : State.NO;

    this.likePost(nextState);
  }

  public handlePostShare(): void {}

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

  // public addPostComment(value: string): void {
  //
  // }
  //
  //
  // public addPostReply(value: string): void {
  //
  // }

  // public isPostOwner(username: string): boolean {
  //   return this.resolvedUser.urlUsername === username;
  // }

  // public isButtonRenderable(condition1, condition2): boolean {
  //   return condition1 || condition2;
  // }

  public getPostReplies$(commentId: string): Observable<Array<UIPostReply>> {
    return this.store.select$(PostsSelectors.getPostRepliesByCommentId, commentId);
  }

  public getPostReplyTotalCount$(commentId: string): Observable<number> {
    return this.store.select$(PostsSelectors.getPostReplyTotalCount, commentId);
  }

  private likePost(nextState: State): void {
    this.store
      .dispatch$(PostsActions.likePost, {postId: this.post._id, like: nextState})
      .pipe(untilDestroyed(this))
      .subscribe();
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
