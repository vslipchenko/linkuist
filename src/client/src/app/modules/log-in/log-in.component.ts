import { Component, OnInit } from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from "../../models/components/navigation";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  hidePassword = true;
  logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initLogInForm();
  }

  private initLogInForm(): void {
    this.logInForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }
}
