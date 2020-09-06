import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../models/components/navigation.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {
  EMAIL_REGEXP,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP
} from '../../constants/validation.constants';
import {generatePassword} from '../../utilities/password.utilities';
import {Clipboard} from "@angular/cdk/clipboard";
import {SnackbarService} from "../../shared/services/snackbar/snackbar.service";
import {UserService} from "../../services/user/user.service";

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

  constructor(private formBuilder: FormBuilder,
              private clipboard: Clipboard,
              private snackbarService: SnackbarService,
              private userService: UserService) {
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
    const password = generatePassword(PASSWORD_MINLENGTH, 20);
    this.signUpForm.patchValue({password});
    this.clipboard.copy(password);
    this.snackbarService.show('Copied to clipboard');
    this.hidePassword = false;
  }

  signUp(): void {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      this.userService.create(this.signUpForm.value).subscribe();
    }
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
