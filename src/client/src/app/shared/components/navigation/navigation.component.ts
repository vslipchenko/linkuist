import {Component, Input, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../../models/components/navigation.model';

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

  get canNavigateToHomepage(): boolean {
    return this.configuration.mainActionHref === NavigationMainActionHref.HOME;
  }

  get tooltipContent(): string {
    return this.canNavigateToHomepage ? 'Home' : 'Profile';
  }
}
