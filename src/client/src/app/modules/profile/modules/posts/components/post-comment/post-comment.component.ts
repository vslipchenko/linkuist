import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Observable} from 'rxjs';
import {AddCommentComponent} from '~app/modules/profile/modules/posts/components/add-comment/add-comment.component';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {FetchResult} from '@apollo/client/core';
import {PostSubcommentCreateMutationResult} from '~app/types/post-subcomment/post-subcomment.interfaces';

@UntilDestroy()
@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent {
  @Input() public readonly postId!: string;
  @Input() public readonly commentId!: string;
  @Input() public readonly avatarUrl!: string;
  @Input() public readonly username!: string;
  @Input() public readonly resolvedUserUrlUsername!: string;
  @Input() public readonly creationDate!: string;
  @Input() public readonly timeElapsedAfterCreation$!: Observable<string>;
  @Input() public readonly body!: string;
  @Input() public readonly isVerifiedUser!: boolean;
  @Input() public readonly panelButtonsRef!: TemplateRef<unknown>;
  @Input() public readonly bottomButtonsRef!: TemplateRef<unknown>;

  @Output() public readonly newSubcomment = new EventEmitter<{id: string; commentId: string}>();

  @ViewChild(AddCommentComponent)
  private readonly addCommentComponent!: AddCommentComponent;

  public _showAddReply = false;

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly store: Store<PostsState>,
  ) {}

  // public ngOnInit(): void {}

  public showAddReply(): void {
    this._showAddReply = true;
    this.changeDetector.detectChanges();
    this.addCommentComponent.focusElasticInput();
    // debugger;
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

  // public focusElasticInput(): void {
  //   // console.log(this.elasticInputComponent.);
  //   this.addCommentComponent.focus();
  // }
}
