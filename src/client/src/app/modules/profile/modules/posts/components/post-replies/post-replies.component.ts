import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AddCommentComponent} from '~app/modules/profile/modules/posts/components/add-comment/add-comment.component';
import {
  PostReplyCreateMutationResult,
  UIPostReply,
} from '~app/types/post-reply/post-reply.interfaces';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {FetchResult} from '@apollo/client/core';
import {State} from '~app/types/shared/shared.enums';

@UntilDestroy()
@Component({
  selector: 'app-post-replies',
  templateUrl: './post-replies.component.html',
  styleUrls: ['./post-replies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostRepliesComponent implements OnInit {
  @Input() public readonly postId!: string;
  @Input() public readonly commentId!: string;
  @Input() public readonly profileTeasers!: ProfileTeasers;
  @Input() public readonly panelButtonsRef!: TemplateRef<unknown>;
  @Input() public readonly bottomButtonsRef!: TemplateRef<unknown>;
  @Input() public readonly resolvedUserUrlUsername!: string;

  @Output() public readonly newReply = new EventEmitter<{id: string; commentId: string}>();

  public postReplies$: Observable<Array<UIPostReply>> = of();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(AddCommentComponent)
  private readonly addCommentComponent!: AddCommentComponent;

  public _showAddReply = false;

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly store: Store<PostsState>,
  ) {}

  public ngOnInit(): void {
    this.postReplies$ = this.store.select$(
      PostsSelectors.getPostRepliesByCommentId,
      this.commentId,
    );
  }

  public showAddReply(): void {
    this._showAddReply = true;
    this.changeDetector.detectChanges();
    this.addCommentComponent.focusElasticInput();
  }
  // Reply reply has to have @username that is going before text body
  public addPostReply(body: string, index: number): void {
    this.store
      .dispatch$<FetchResult<PostReplyCreateMutationResult>>(PostsActions.createPostReply, {
        replyPayload: {
          postId: this.postId,
          commentId: this.commentId,
          body,
        },
        insertAtPosition: index + 1, // Insert right after reply being replied to
      })
      .pipe(untilDestroyed(this))
      .subscribe((result) =>
        this.newReply.emit({
          id: result.data!.createPostReply._id,
          commentId: this.commentId,
        }),
      );
  }

  public handlePostReplyDelete(replyId: string): void {
    this.store
      .dispatch$(PostsActions.deletePostReply, {
        postId: this.postId,
        commentId: this.commentId,
        replyId,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  public handlePostReplyLike(currentState: State, replyId: string): void {
    const nextState = currentState === State.YES ? State.NONE : State.YES;

    this.likePostReply(nextState, replyId);
  }

  public handlePostReplyDislike(currentState: State, replyId: string): void {
    const nextState = currentState === State.NO ? State.NONE : State.NO;

    this.likePostReply(nextState, replyId);
  }

  private likePostReply(nextState: State, replyId: string): void {
    this.store
      .dispatch$(PostsActions.likePostReply, {
        commentId: this.commentId,
        replyId,
        like: nextState,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
