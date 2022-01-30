import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {Observable} from 'rxjs';
import {POST_COMMENT_MAX_LENGTH} from '~app/constants/post';
import {AddCommentComponent} from '~app/modules/profile/modules/posts/components/add-comment/add-comment.component';
import {State} from '~app/types/shared/shared.enums';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {
  @Input() public readonly isPost!: boolean; // Else post comment / reply
  @Input() public readonly postId!: string;
  @Input() public readonly commentId!: string;
  @Input() public readonly avatarUrl!: string;
  @Input() public readonly username!: string;
  @Input() public readonly resolvedUserUrlUsername!: string;
  @Input() public readonly creationDate!: string;
  @Input() public readonly timeElapsedAfterCreation$!: Observable<string>;
  @Input() public readonly body!: string;
  @Input() public readonly isVerifiedUser!: boolean;
  @Input() public readonly liked!: State;

  @Input() public readonly likeTotalCount!: number;
  @Input() public readonly dislikeTotalCount!: number;
  @Input() public readonly commentTotalCount!: number;
  @Input() public readonly shareTotalCount!: number;

  @Input() public readonly ngClasses!: {[className: string]: boolean};
  // @Input() public readonly panelButtonsRef!: TemplateRef<unknown>;
  // @Input() public readonly bottomButtonsRef!: TemplateRef<unknown>;

  @Output() public readonly like = new EventEmitter<State>();
  @Output() public readonly dislike = new EventEmitter<State>();
  @Output() public readonly share = new EventEmitter<void>();
  @Output() public readonly delete = new EventEmitter<void>();
  @Output() public readonly comment = new EventEmitter<string>();

  @Input() public showAddComment!: boolean;

  @ViewChild(AddCommentComponent) public addCommentComponent!: AddCommentComponent;

  public readonly POST_COMMENT_MAX_LENGTH = POST_COMMENT_MAX_LENGTH;

  public constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public toggleAddComment(): void {
    this.showAddComment = !this.showAddComment;

    if (!this.showAddComment) return; // Simply hide

    this.changeDetector.detectChanges();
    this.addCommentComponent.focusElasticInput();
  }

  public get isLiked(): boolean {
    return this.liked === State.YES;
  }

  public get isDisliked(): boolean {
    return this.liked === State.NO;
  }
}
