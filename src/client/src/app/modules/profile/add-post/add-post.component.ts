import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core/common-behaviors/color';
import {POST_MAX_LENGTH} from '~app/constants/post';
import {FormControl} from '@angular/forms';
// import { LengthCircleDefineColor } from "~app/shared/types/length-circle/length-circle.interfaces";
// import {ThemePalette} from '@angular/material/core/common-behaviors/color';
// import {LengthCircleColorMap} from '~app/shared/types/length-circle/length-circle.types';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent {
  // @Input() public readonly resolvedUser: ResolvedUser = {
  //   role: UserRole.VIEWER,
  //   urlUsername: '',
  //   relativePaths: [],
  // };

  @Output() public addPost = new EventEmitter<string>();

  public readonly POST_MAX_LENGTH = POST_MAX_LENGTH;
  public readonly addPostControl = new FormControl('');
  // public characterLengthSpinnerColor: ThemePalette = 'primary';
  public characterLength = 0;

  // constructor() {}
  //
  // ngOnInit(): void {}

  public inputChange(event: Event): void {
    this.characterLength = (event.target as HTMLSpanElement).textContent!.length;
    // this.calculateCharacterLength(event);
  }

  public defineLengthCircleColor(value: number): ThemePalette {
    if (value > POST_MAX_LENGTH - 2) return 'warn';
    if (value > POST_MAX_LENGTH - 5) return 'accent';
    return 'primary';
    // if pe
  }

  public handleAddPost(): void {
    this.addPost.emit(this.addPostControl.value);
    this.addPostControl.reset('');
  }

  // public handleLengthChange(value: number): ThemePalette {
  //
  // }

  // private calculateCharacterLength(event: Event): void {
  //   this.characterLengthValue =
  //     ((event.target as HTMLSpanElement).textContent!.length * 100) / POST_MAX_LENGTH;
  // }
}
