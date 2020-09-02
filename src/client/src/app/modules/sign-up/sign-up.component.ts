import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../models/components/navigation';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {EMAIL_REGEXP, USERNAME_REGEXP} from '../../constants/regexp.constants';

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
      email: ['', [Validators.pattern(EMAIL_REGEXP)]],
      username: ['', [Validators.maxLength(33), Validators.pattern(USERNAME_REGEXP)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(50)]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]]
    });
  }

  private repeatPasswordValidator(control: AbstractControl): null | ValidationErrors {
    return control.value === this.passwordField?.value ? null : {passwordMismatch: true};
  }

  get emailField(): AbstractControl {
    return this.signUpForm.get('email');
  }

  get usernameField(): AbstractControl {
    return this.signUpForm.get('username');
  }

  get passwordField(): AbstractControl {
    return this.signUpForm?.get('password');
  }

  get repeatPasswordField(): AbstractControl {
    return this.signUpForm.get('repeatPassword');
  }
}
