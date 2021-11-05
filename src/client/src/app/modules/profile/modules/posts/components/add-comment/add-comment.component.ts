import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ElasticInputComponent} from '~app/shared/components/elastic-input/elastic-input.component';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent {
  @Input() public readonly maxCharLength!: number;
  @Input() public readonly placeholder!: string;

  @Output() public readonly comment = new EventEmitter<string>();

  @ViewChild(ElasticInputComponent, {static: true})
  private readonly elasticInputComponent!: ElasticInputComponent;

  public readonly addCommentControl = new FormControl('');

  public focusElasticInput(): void {
    // console.log(this.elasticInputComponent.);
    this.elasticInputComponent.focus();
  }

  public addComment(): void {
    this.comment.emit(this.addCommentControl.value);
    // Reset
    this.addCommentControl.setValue('');
  }
}
