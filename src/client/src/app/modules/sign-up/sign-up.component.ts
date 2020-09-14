import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from '../../models/components/navigation.model';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {
  EMAIL_REGEXP,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP,
  USERNAME_SEPARATORS
} from '../../constants/validation.constants';
import {generatePassword} from '../../utilities/password/password.utilities';
import {Clipboard} from "@angular/cdk/clipboard";
import {SnackbarService} from "../../shared/services/snackbar/snackbar.service";
import {UserService} from "../../services/user/user.service";
import {map} from "rxjs/operators";
import {ValidationService} from "../../shared/services/validation/validation.service";

// TODO unsubscribe decorator
@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  signUpForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder,
              private clipboard: Clipboard,
              private snackbarService: SnackbarService,
              private userService: UserService,
              private validationService: ValidationService) {
  }

  ngOnInit(): void {
    this.initSignUpForm();
  }

  private initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)], this.validationService.userEmailValidator.bind(this)],
      username: ['', [SignUpComponent.usernameValidator], this.usernameValidator.bind(this)],
      password: ['', [SignUpComponent.passwordValidator]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]]
    });
  }

  private usernameValidator(control: AbstractControl): null | ValidationErrors {
    const username = control.value;
    return this.userService.getIdByUsername(username).pipe(map(({data}) => {
      return data.userByUsername?._id ? {isUsed: true} : null;
    }));
  }

  private static usernameValidator(control: AbstractControl): null | ValidationErrors {
    const username = control.value;
    const isEmpty = !username.length;
    const tooLong = username.length > USERNAME_MAXLENGTH;
    const validFormat = USERNAME_REGEXP.test(username);

    if (isEmpty) {
      return {required: true};
    } else if (tooLong) {
      return {maxlength: true};
    }

    return validFormat ? null : {pattern: true};
  }

  private static passwordValidator(control: AbstractControl): null | ValidationErrors {
    const password = control.value;
    const isEmpty = !password.length;
    const hasNumber = password.search(/[0-9]/) !== -1;
    const hasLetter = password.search(/[A-Za-z]/) !== -1;
    const tooShort = password.length < PASSWORD_MINLENGTH;
    const tooLong = password.length > PASSWORD_MAXLENGTH;

    switch (true) {
      case isEmpty:
        return {required: true};
      case tooShort:
        return {minlength: true};
      case tooLong:
        return {maxlength: true};
      case !hasNumber:
        return {hasNoNumber: true};
      case !hasLetter:
        return {hasNoLetter: true};
      default:
        const validFormat = PASSWORD_REGEXP.test(password);
        return validFormat ? null : {pattern: true};
    }
  }

  private repeatPasswordValidator(control: AbstractControl): null | ValidationErrors {
    const repeatPassword = control.value;
    const isEmpty = !repeatPassword.length;

    if (isEmpty) {
      return {required: true};
    }

    const arePasswordsEqual = repeatPassword === this.passwordField?.value;

    return arePasswordsEqual ? null : {mismatch: true};
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
      this.isSubmitting = true;
      const snackbar = this.snackbarService.showInfinite('Creating account...');
      this.userService.create(this.signUpForm.value)
        .subscribe(
          () => {
            this.isSubmitting = false;
            snackbar.dismiss();
            this.snackbarService.showSuccess('Successfully created!');
          },
          () => {
            this.isSubmitting = false;
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
