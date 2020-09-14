import { Component, OnInit } from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from "../../models/components/navigation.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  hidePassword = true;
  signInForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initSignInForm();
  }

  private initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }
}
