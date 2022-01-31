import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {FetchResult} from '@apollo/client/core';
import {PostReplyCreateMutationResult} from '~app/types/post-reply/post-reply.interfaces';
import {PostItemComponent} from '~app/modules/profile/modules/posts/components/post-item/post-item.component';
import {State} from '~app/types/shared/shared.enums';

@UntilDestroy()
@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent implements OnInit {
  @Input() public readonly postId!: string;
  @Input() public readonly commentId!: string;
  @Input() public readonly postItemComponent!: PostItemComponent;

  @Output() public readonly newReply = new EventEmitter<{id: string; commentId: string}>();

  public constructor(private readonly store: Store<PostsState>) {}

  public ngOnInit(): void {
    this.postItemComponent.delete
      .pipe(untilDestroyed(this))
      .subscribe(this.handlePostCommentDelete.bind(this));

    this.postItemComponent.comment
      .pipe(untilDestroyed(this))
      .subscribe(this.addPostReply.bind(this));

    this.postItemComponent.like
      .pipe(untilDestroyed(this))
      .subscribe(this.handlePostCommentLike.bind(this));

    this.postItemComponent.dislike
      .pipe(untilDestroyed(this))
      .subscribe(this.handlePostCommentDislike.bind(this));
  }

  private handlePostCommentLike(currentState: State): void {
    const nextState = currentState === State.YES ? State.NONE : State.YES;

    this.likePostComment(nextState);
  }

  private handlePostCommentDislike(currentState: State): void {
    const nextState = currentState === State.NO ? State.NONE : State.NO;

    this.likePostComment(nextState);
  }

  private likePostComment(nextState: State): void {
    this.store
      .dispatch$(PostsActions.likePostComment, {
        postId: this.postId,
        commentId: this.commentId,
        like: nextState,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private handlePostCommentDelete(): void {
    this.store
      .dispatch$(PostsActions.deletePostComment, {postId: this.postId, commentId: this.commentId})
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private addPostReply(body: string): void {
    this.store
      .dispatch$<FetchResult<PostReplyCreateMutationResult>>(PostsActions.createPostReply, {
        replyPayload: {
          postId: this.postId,
          commentId: this.commentId,
          body,
        },
        insertAtPosition: 0,
      })
      .pipe(untilDestroyed(this))
      .subscribe((result) =>
        this.newReply.emit({
          id: result.data!.createPostReply._id,
          commentId: this.commentId,
        }),
      );
  }
}
