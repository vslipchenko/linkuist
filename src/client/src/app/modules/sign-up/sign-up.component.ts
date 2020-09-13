import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../models/components/navigation.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {
  EMAIL_REGEXP,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH, PASSWORD_REGEXP,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP, USERNAME_SEPARATORS
} from '../../constants/validation.constants';
import {generatePassword} from '../../utilities/password.utilities';
import {Clipboard} from "@angular/cdk/clipboard";
import {SnackbarService} from "../../shared/services/snackbar/snackbar.service";
import {UserService} from "../../services/user/user.service";
import {map} from "rxjs/operators";

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
  // snackbarRef;

  constructor(private formBuilder: FormBuilder,
              private clipboard: Clipboard,
              private snackbarService: SnackbarService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.initSignUpForm();
  }

  // TODO merge username and password validators to prevent multiple error display
  private initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.pattern(EMAIL_REGEXP)], this.emailValidator.bind(this)],
      username: ['', [Validators.maxLength(USERNAME_MAXLENGTH), Validators.pattern(USERNAME_REGEXP)], this.usernameValidator.bind(this)],
      password: ['', [Validators.minLength(PASSWORD_MINLENGTH), Validators.maxLength(PASSWORD_MAXLENGTH), SignUpComponent.passwordValidator]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]]
    });
  }

  private emailValidator (control: AbstractControl): null | ValidationErrors {
    const email = control.value;
    return this.userService.getIdByEmail(email).pipe(map(({data}) => {
      return data.userByEmail?._id ? {isUsed: true} : null;
    }));
  }

  private usernameValidator (control: AbstractControl): null | ValidationErrors {
    const username = control.value;
    return this.userService.getIdByUsername(username).pipe(map(({data}) => {
      return data.userByUsername?._id ? {isUsed: true} : null;
    }));
  }

  private static passwordValidator(control: AbstractControl): null | ValidationErrors {
    const password = control.value;
    const hasNumber = password.search(/[0-9]/) !== -1;
    const hasLetter = password.search(/[A-Za-z]/) !== -1;

    if (!hasNumber) {
      return {hasNoNumber: true};
    } else if (!hasLetter) {
      return {hasNoLetter: true};
    }

    return PASSWORD_REGEXP.test(password) ? null : {pattern: true};
  }

  private repeatPasswordValidator(control: AbstractControl): null | ValidationErrors {
    const repeatPassword = control.value;
    return repeatPassword === this.passwordField?.value ? null : {passwordMismatch: true};
  }

  generatePassword(): void {
    const password = generatePassword(PASSWORD_MINLENGTH, 16);
    this.signUpForm.patchValue({password});
    this.clipboard.copy(password);
    this.snackbarService.showWithDismiss('Copied to clipboard');
    this.hidePassword = false;
  }

  signUp(): void {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      const snackbar = this.snackbarService.showInfinite('Creating account...');
      this.userService.create(this.signUpForm.value)
        .subscribe(
          () => {
            snackbar.dismiss();
            this.snackbarService.showSuccess('Successfully created!');
          },
          () => {
            snackbar.dismiss();
            this.snackbarService.showError();
          }
        );
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

  get usernameSeparators(): string {
    return USERNAME_SEPARATORS;
  }
}
