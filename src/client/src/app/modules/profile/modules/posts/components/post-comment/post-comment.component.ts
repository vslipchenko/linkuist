import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {Observable} from 'rxjs';
import {AddCommentComponent} from '~app/modules/profile/modules/posts/components/add-comment/add-comment.component';
import {Store} from '@ng-estate/store';
import {PostsState} from '~app/modules/profile/modules/posts/store';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent {
  @Input() public readonly avatarUrl!: string;
  @Input() public readonly username!: string;
  @Input() public readonly resolvedUserUrlUsername!: string;
  @Input() public readonly creationDate!: string;
  @Input() public readonly timeElapsedAfterCreation$!: Observable<string>;
  @Input() public readonly body!: string;
  @Input() public readonly isVerifiedUser!: boolean;

  // @Output() public readonly comment = new EventEmitter<string>();

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

  public addPostComment(value: string): void {}

  // public focusElasticInput(): void {
  //   // console.log(this.elasticInputComponent.);
  //   this.addCommentComponent.focus();
  // }
}
