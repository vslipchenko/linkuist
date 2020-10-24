import {Component, Input, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../../models/components/navigation';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  private readonly defaultConfiguration: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.NONE
  };

  @Input() configuration = this.defaultConfiguration;

  constructor() {
  }

  ngOnInit(): void {
  }

  get tooltipContent(): string {
    switch (this.configuration.mainActionHref) {
      case NavigationMainActionHref.NONE:
        return '';
      case NavigationMainActionHref.HOME:
        return 'Home';
      default: // assume account
        return 'Profile';
    }
  }
}
