import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {
  EMAIL_MAXLENGTH,
  EMAIL_REGEXP,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP,
  USERNAME_SEPARATORS
} from '@constants/validation';
import {generatePassword} from '@utilities/password/password.utilities';
import {Clipboard} from '@angular/cdk/clipboard';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {UserService} from '@services/user/user.service';
import {finalize, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ProgressBarService} from '@shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '@services/authentication/authentication.service';

// TODO unsubscribe decorator
@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder,
              private clipboard: Clipboard,
              private snackbarService: SnackbarService,
              private userService: UserService,
              private router: Router,
              private progressBarService: ProgressBarService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.initSignUpForm();
  }

  private initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)], this.emailValidator.bind(this)],
      username: ['', [SignUpComponent.usernameValidator], this.usernameValidator.bind(this)],
      password: ['', [SignUpComponent.passwordValidator]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]]
    });
  }

  private emailValidator(control: AbstractControl): null | ValidationErrors {
    const email = control.value;
    return this.userService.getIdByEmail(email).pipe(map(({data}) => {
      return data.userByEmail?._id ? {isUsed: true} : null;
    }));
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
    // const tooLong = username.length > USERNAME_MAXLENGTH;
    const validFormat = USERNAME_REGEXP.test(username);

    if (isEmpty) {
      return {required: true};
    }
    // else if (tooLong) {
    //   return {maxlength: true};
    // }

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
    this.snackbarService.showWithDismiss('Copied to the clipboard');
    this.hidePassword = false;
  }

  signUp(): void {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      this.isSubmitting = true;
      // const snackbar = this.snackbarService.showInfinite('Creating account...');
      this.progressBarService.show();
      this.userService.create(this.signUpForm.value)
        .pipe(finalize(() => {
          this.isSubmitting = false;
          this.progressBarService.hide();
        }))
        .subscribe(
          () => {
            // TODO add form reset button that dismisses infinite snackbar as well
            this.snackbarService
              .showInfinite('Successfully signed up!', {action: 'Sign in'})
              .afterDismissed()
              .subscribe(() => {
                this.router.navigate(['/sign-in']);
              });
          },
          () => {
            this.snackbarService.showError();
          }
        );
    }
  }

  get emailField(): AbstractControl {
    return this.signUpForm.get('email');
  }

  get emailMaxLength(): number {
    return EMAIL_MAXLENGTH;
  }

  // get isEmailLengthExceeded(): boolean {
  //   return this.emailField.value.length > EMAIL_MAXLENGTH;
  // }

  get usernameField(): AbstractControl {
    return this.signUpForm.get('username');
  }

  get usernameMaxLength(): number {
    return USERNAME_MAXLENGTH;
  }

  // get isUsernameLengthExceeded(): boolean {
  //   return this.usernameField.value.length > USERNAME_MAXLENGTH;
  // }

  get usernameSeparators(): string {
    return USERNAME_SEPARATORS;
  }

  get passwordField(): AbstractControl {
    return this.signUpForm?.get('password');
  }

  get repeatPasswordField(): AbstractControl {
    return this.signUpForm.get('repeatPassword');
  }

  get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
