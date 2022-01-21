import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-comment-manage-panel',
  templateUrl: './comment-manage-panel.component.html',
  styleUrls: ['./comment-manage-panel.component.scss'],
})
export class CommentManagePanelComponent {
  @Input() public readonly data!: any;
  @Input() public readonly isLoading!: boolean;
  @Input() public readonly isComment!: boolean; // Else subcomment
  @Input() public readonly totalCount!: number;
  @Input() public readonly extendClass!: string;

  @Output() public readonly loadMore = new EventEmitter<any>();
  @Output() public readonly hide = new EventEmitter<void>();
}
