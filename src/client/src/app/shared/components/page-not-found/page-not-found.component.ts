import { Component, OnInit } from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../../models/components/navigation';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  constructor() { }

  ngOnInit(): void {
  }

}
