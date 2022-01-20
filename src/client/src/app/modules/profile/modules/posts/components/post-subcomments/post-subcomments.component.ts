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
  PostSubcommentCreateMutationResult,
  UIPostSubcomment,
} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {FetchResult} from '@apollo/client/core';

@UntilDestroy()
@Component({
  selector: 'app-post-subcomments',
  templateUrl: './post-subcomments.component.html',
  styleUrls: ['./post-subcomments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostSubcommentsComponent implements OnInit {
  @Input() public readonly postId!: string;
  @Input() public readonly commentId!: string;
  @Input() public readonly profileTeasers!: ProfileTeasers;
  @Input() public readonly panelButtonsRef!: TemplateRef<unknown>;
  @Input() public readonly bottomButtonsRef!: TemplateRef<unknown>;
  @Input() public readonly resolvedUserUrlUsername!: string;

  @Output() public readonly newSubcomment = new EventEmitter<{id: string; commentId: string}>();

  public postSubcomments$: Observable<Array<UIPostSubcomment>> = of();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(AddCommentComponent)
  private readonly addCommentComponent!: AddCommentComponent;

  public _showAddReply = false;

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly store: Store<PostsState>,
  ) {}

  public ngOnInit(): void {
    this.postSubcomments$ = this.store.select$(
      PostsSelectors.getPostSubcommentsByCommentId,
      this.commentId,
    );
  }

  public showAddReply(): void {
    this._showAddReply = true;
    this.changeDetector.detectChanges();
    this.addCommentComponent.focusElasticInput();
    // debugger;
  }
  // Subcomment reply has to have @username that is going before text body
  public addPostSubcomment(body: string, index: number): void {
    this.store
      .dispatch$<FetchResult<PostSubcommentCreateMutationResult>>(
        PostsActions.createPostSubcomment,
        {
          subcommentPayload: {
            postId: this.postId,
            commentId: this.commentId,
            body,
          },
          insertAtPosition: index + 1, // Insert right after subcomment being replied to
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

  public handlePostSubcommentDelete(): void {
    // NOT IMPLEMENTED YET
    // this.store
    //   .dispatch$(PostsActions.deletePostComment, {postId: this.postId, commentId: this.commentId})
    //   .pipe(untilDestroyed(this))
    //   .subscribe();
  }
}
