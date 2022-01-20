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
import {PostSubcommentCreateMutationResult} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {PostItemComponent} from '~app/modules/profile/modules/posts/components/post-item/post-item.component';

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

  @Output() public readonly newSubcomment = new EventEmitter<{id: string; commentId: string}>();

  public constructor(private readonly store: Store<PostsState>) {}

  public ngOnInit(): void {
    this.postItemComponent.delete
      .pipe(untilDestroyed(this))
      .subscribe(this.handlePostCommentDelete.bind(this));

    this.postItemComponent.comment
      .pipe(untilDestroyed(this))
      .subscribe(this.addPostSubcomment.bind(this));
  }

  public handlePostCommentDelete(): void {
    this.store
      .dispatch$(PostsActions.deletePostComment, {postId: this.postId, commentId: this.commentId})
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  public addPostSubcomment(body: string): void {
    this.store
      .dispatch$<FetchResult<PostSubcommentCreateMutationResult>>(
        PostsActions.createPostSubcomment,
        {
          subcommentPayload: {
            postId: this.postId,
            commentId: this.commentId,
            body,
          },
          insertAtPosition: 0,
        },
      )
      .pipe(untilDestroyed(this))
      .subscribe((result) =>
        this.newSubcomment.emit({
          id: result.data!.createPostSubcomment._id,
          commentId: this.commentId,
        }),
      );
  }
}
