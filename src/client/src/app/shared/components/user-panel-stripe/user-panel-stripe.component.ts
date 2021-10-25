import {Component, Inject, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-user-post-panel',
  templateUrl: './user-panel-stripe.component.html',
})
export class UserPanelStripeComponent {
  @Input() public readonly extendsClass!: string;
  @Input() public readonly avatarUrl!: string;
  @Input() public readonly username!: string;
  @Input() public readonly resolvedUserUrlUsername!: string;
  @Input() public readonly creationDate!: string;
  @Input() public readonly timeElapsedAfterCreation$!: Observable<string>;

  public constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  public scrollTop(): void {
    // this.window.scrollTo(0, 0);
    this.document.getElementById('main')!.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  public isPostOwner(username: string): boolean {
    return this.resolvedUserUrlUsername === username;
  }
}
