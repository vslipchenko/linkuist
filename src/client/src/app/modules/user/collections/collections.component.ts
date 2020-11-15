import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationMainActionType} from '../../../models/components/navigation';
import {DialogService} from '../../../shared/services/dialog/dialog.service';
import {DialogTypes} from '../../../models/components/dialog';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  @ViewChild('addBookmarkContent') addBookmarkContent: TemplateRef<unknown>;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  addBookmark(): void {
    this.dialogService.open({type: DialogTypes.ADD, contentTemplateRef: this.addBookmarkContent});
  }

  get navigationMainActionType(): NavigationMainActionType {
    return NavigationMainActionType.PROFILE;
  }
}
