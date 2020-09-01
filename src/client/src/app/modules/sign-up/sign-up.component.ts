import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from "../../models/components/navigation";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  hidePassword = true;
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initSignUpForm();
  }

  private initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: [''],
      username: [''],
      password: [''],
      repeatPassword: ['']
    });
  }
}
