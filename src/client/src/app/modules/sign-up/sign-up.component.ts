import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from "../../models/components/navigation";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
