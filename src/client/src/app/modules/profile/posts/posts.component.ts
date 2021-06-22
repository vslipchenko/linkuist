import {Component, Input, OnInit} from '@angular/core';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {UserRole} from '~app/types/user/user.enums';
import {PostService} from '~app/services/post/post.service';
import {getId} from '~app/utilities/unique';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @Input() public readonly resolvedUser: ResolvedUser = {role: UserRole.Viewer, urlUsername: ''};
  public readonly UserRole = UserRole;

  public constructor(private readonly postService: PostService) {}

  public ngOnInit(): void {}

  public createPost(text: string): void {
    this.postService.create({
      id: getId(),
      text,
    });
  }
}
