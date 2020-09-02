import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../models/components/navigation';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {
  EMAIL_REGEXP, PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP
} from '../../constants/validation.constants';
import {generatePassword} from '../../utilities/password.utilities';

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
      username: ['', [Validators.maxLength(USERNAME_MAXLENGTH), Validators.pattern(USERNAME_REGEXP)]],
      password: ['', [Validators.minLength(PASSWORD_MINLENGTH), Validators.maxLength(PASSWORD_MAXLENGTH)]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]]
    });
  }

  private repeatPasswordValidator(control: AbstractControl): null | ValidationErrors {
    return control.value === this.passwordField?.value ? null : {passwordMismatch: true};
  }

  generatePassword(): void {
    this.signUpForm.patchValue({password: generatePassword(PASSWORD_MINLENGTH, 20)});
    this.hidePassword = false;
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
