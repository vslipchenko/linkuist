import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  EMAIL_MAXLENGTH,
  EMAIL_REGEXP,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAXLENGTH,
  USERNAME_REGEXP,
  USERNAME_SEPARATORS,
} from '~app/constants/regexps';
import {generatePassword} from '~app/utilities/password';
import {Clipboard} from '@angular/cdk/clipboard';
import {SnackbarService} from '~app/shared/services/snackbar/snackbar.service';
import {UserService} from '~app/services/user/user.service';
import {finalize, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {Observable} from 'rxjs';

// TODO unsubscribe decorator
@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public hidePassword = true;
  public isSubmitting = false;
  public signUpForm: FormGroup | undefined;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clipboard: Clipboard,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly progressBarService: ProgressBarService,
    private readonly authenticationService: AuthenticationService, // private readonly translateService: TranslateService, // private readonly appTranslateService: AppTranslateService,
  ) {}

  public get emailField(): AbstractControl | null | undefined {
    return this.signUpForm?.get('email');
  }

  public get emailMaxLength(): number {
    return EMAIL_MAXLENGTH;
  }

  public get usernameField(): AbstractControl | null | undefined {
    return this.signUpForm?.get('username');
  }

  public get usernameMaxLength(): number {
    return USERNAME_MAXLENGTH;
  }

  public get usernameSeparators(): string {
    return USERNAME_SEPARATORS;
  }

  public get passwordField(): AbstractControl | null | undefined {
    return this.signUpForm?.get('password');
  }

  public get repeatPasswordField(): AbstractControl | null | undefined {
    return this.signUpForm?.get('repeatPassword');
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
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
      default: {
        const validFormat = PASSWORD_REGEXP.test(password);
        return validFormat ? null : {pattern: true};
      }
    }
  }

  public ngOnInit(): void {
    // this.appTranslateService.setupTranslate(this.translateService);
    this.initSignUpForm();
  }

  // get isEmailLengthExceeded(): boolean {
  //   return this.emailField.value.length > EMAIL_MAXLENGTH;
  // }

  public signUp(): void {
    this.signUpForm?.markAllAsTouched();
    if (this.signUpForm?.valid) {
      this.isSubmitting = true;
      // const snackbar = this.snackbarService.showInfinite('Creating account...');
      this.progressBarService.show();
      this.userService
        .create(this.signUpForm.value)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.progressBarService.hide();
          }),
        )
        .subscribe(
          () => {
            // TODO add form reset button that dismisses infinite snackbar as well
            this.snackbarService
              .showInfinite('Successfully signed up!', {action: 'Sign in'})
              .afterDismissed()
              .subscribe(() => {
                void this.router.navigate(['/sign-in']);
              });
          },
          () => {
            this.snackbarService.showError();
          },
        );
    }
  }

  public generatePassword(): void {
    const password = generatePassword(PASSWORD_MINLENGTH, 16);
    this.signUpForm?.patchValue({password});
    this.clipboard.copy(password);
    this.snackbarService.showWithDismiss('Copied to the clipboard');
    this.hidePassword = false;
  }

  // get isUsernameLengthExceeded(): boolean {
  //   return this.usernameField.value.length > USERNAME_MAXLENGTH;
  // }

  private initSignUpForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required.bind(this), Validators.pattern(EMAIL_REGEXP)],
        this.emailValidator.bind(this),
      ],
      username: [
        '',
        [SignUpComponent.usernameValidator.bind(this)],
        this.usernameValidator.bind(this),
      ],
      password: ['', [SignUpComponent.passwordValidator.bind(this)]],
      repeatPassword: ['', [this.repeatPasswordValidator.bind(this)]],
    });
  }

  private emailValidator(control: AbstractControl): null | ValidationErrors {
    const email = control.value;
    return this.userService.getIdByEmail(email).pipe(
      map(({data}) => {
        return data.userByEmail?._id ? {isUsed: true} : null;
      }),
    );
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

  private usernameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;
    return this.userService.getIdByUsername(username).pipe(
      map(({data}) => {
        return data.userByUsername?._id ? {isUsed: true} : null;
      }),
    );
  }
}
