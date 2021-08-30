import {ChangeDetectionStrategy, Component, Inject, Input, Output} from '@angular/core';
import {ResolvedUserService} from '~app/services/resolved-user/resolved-user.service';
import {DOCUMENT} from '@angular/common';
import {PostService} from '~app/services/post/post.service';
import {UntilDestroy, untilDestroyed} from '~app/utilities/until-destroy';
import {UserRole} from '~app/types/user/user.enums';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {finalize} from 'rxjs/operators';
import {FetchResult} from '@apollo/client/core';
import {PostDeleteCountMutationResult} from '~app/types/post/post.interfaces';
import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {POST_COMMENT_MAX_LENGTH} from '~app/constants/post';

@UntilDestroy()
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input() public readonly post: any;
  @Input() public readonly profileTeasers: {[userId: string]: any} = {};

  @Output() public readonly deletePost = new EventEmitter<string>();

  public readonly POST_COMMENT_MAX_LENGTH = POST_COMMENT_MAX_LENGTH;
  public readonly addCommentControl = new FormControl('');

  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly resolvedUserService: ResolvedUserService,
    private readonly postService: PostService,
    private readonly progressBarService: ProgressBarService,
  ) {}

  // ngOnInit(): void {}

  public scrollTop(): void {
    // this.window.scrollTo(0, 0);
    this.document.getElementById('main')!.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public delete(_id: string): void {
    this.progressBarService.show();
    console.log(_id, this.post);
    this.postService
      .deleteById(_id)
      .pipe(
        untilDestroyed(this),
        finalize(() => this.progressBarService.hide()),
      )
      .subscribe(({data}: FetchResult<PostDeleteCountMutationResult>) => {
        if (data?.deletePost) this.deletePost.emit(_id);
      });
  }

  public isPostOwner(username: string): boolean {
    return this.resolvedUserService.user.urlUsername === username;
  }

  public get hasUserRole(): boolean {
    return this.resolvedUserService.user.role === UserRole.USER;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('CHANGES ', changes);
  // }
  //
  // ngDoCheck(): void {
  //   console.log('CHECK ', this);
  // }
}
