import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AddCommentComponent} from '~app/modules/profile/modules/posts/components/add-comment/add-comment.component';
import {UIPostSubcomment} from '~app/types/post-subcomment/post-subcomment.interfaces';
import {PostsSelectors} from '~app/modules/profile/modules/posts/store/posts.selectors';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';
import {ProfileTeasers} from '~app/types/profile/profile.interfaces';
import {PostsActions} from '~app/modules/profile/modules/posts/store/posts.actions';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';

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
  // @Input() public readonly avatarUrl!: string;
  // @Input() public readonly username!: string;
  // @Input() public readonly resolvedUserUrlUsername!: string;
  // @Input() public readonly creationDate!: string;
  // @Input() public readonly timeElapsedAfterCreation$!: Observable<string>;
  // @Input() public readonly body!: string;
  // @Input() public readonly isVerifiedUser!: boolean;

  @Input() public readonly profileTeasers!: ProfileTeasers;

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
  public addPostSubcomment(body: string): void {
    this.store
      .dispatch$(PostsActions.createPostSubcomment, {
        subcommentPayload: {
          postId: this.postId,
          commentId: this.commentId,
          body,
        },
        insertAtPosition: undefined, // TODO
      })
      .pipe(untilDestroyed(this))
      .subscribe(console.log);
  }
}
