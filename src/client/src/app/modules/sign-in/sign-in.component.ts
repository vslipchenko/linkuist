import {Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '@@types/navigation/navigation.enums';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {EMAIL_REGEXP, PASSWORD_REGEXP} from '@constants/regexps';
import {ErrorStateMatcher} from '@angular/material/core';
import {combineLatest} from 'rxjs';
import {AuthenticationService} from '@services/authentication/authentication.service';
import {SnackbarService} from '@shared/services/snackbar/snackbar.service';
import {ApolloError} from '@apollo/client/core';
import {shapeGraphQLErrors} from '@utilities/graphql';
import {ProgressBarService} from '@shared/services/progress-bar/progress-bar.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private readonly snackbarService: SnackbarService,
    private readonly progressBarService: ProgressBarService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initSignInForm();
    this.resetPatternErrorOnInput();
    // this.authenticationService.mock().subscribe();
    // console.log(this.authenticationService.accessTokenData);
  }

  private static emailValidator(control: AbstractControl): null | ValidationErrors {
    const email = control.value;
    const isEmpty = !email.length;

    return isEmpty ? {required: true} : null;
  }

  private static passwordValidator(control: AbstractControl): null | ValidationErrors {
    const password = control.value;
    const isEmpty = !password.length;

    return isEmpty ? {required: true} : null;
  }

  get customErrorStateMatcher(): ErrorStateMatcher {
    return {
      // email or password field touched and is empty OR one of them has pattern error
      isErrorState: (control) =>
        (control.touched && control.hasError('required')) ||
        (this.passwordField.touched && this.passwordField.hasError('required')) ||
        control.hasError('pattern') ||
        this.passwordField.hasError('pattern'),
    } as ErrorStateMatcher;
  }

  signIn(): void {
    this.signInForm.markAllAsTouched();
    if (this.signInForm.valid) {
      if (this.isInvalidUserData) {
        return this.dispatchErrors({pattern: true});
      }

      this.isSubmitting = true;
      // const snackbar = this.snackbarService.showInfinite('Loading...');
      this.progressBarService.show();

      this.authenticationService
        .signIn(this.signInForm.value)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.progressBarService.hide();
          }),
        )
        .subscribe(
          ({data}) => {
            this.authenticationService.tokens = data.signIn;
            const username = this.authenticationService.accessTokenData.username;

            this.router.navigate([`/@${username}`]);
          },
          ({graphQLErrors}: ApolloError) => {
            const errors = shapeGraphQLErrors(graphQLErrors);

            errors.forEach((error) => {
              switch (error.code) {
                case 'BAD_USER_INPUT':
                  return this.dispatchErrors({pattern: true});
                default:
                  // 'INTERNAL_SERVER_ERROR'
                  this.snackbarService.showError();
              }
            });
          },
        );
    }
  }

  private dispatchErrors(error: ValidationErrors | null): void {
    this.emailField.setErrors(error);
    this.passwordField.setErrors(error);
  }

  private initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [SignInComponent.emailValidator]],
      password: ['', [SignInComponent.passwordValidator]],
    });
  }

  private get emailField(): AbstractControl {
    return this.signInForm.get('email');
  }

  private get passwordField(): AbstractControl {
    return this.signInForm.get('password');
  }

  private get isInvalidUserData(): boolean {
    const invalidPasswordPattern = !PASSWORD_REGEXP.test(this.passwordField.value);
    const invalidEmailPattern = !EMAIL_REGEXP.test(this.emailField.value);

    return invalidPasswordPattern || invalidEmailPattern;
  }

  get hasRequiredError(): boolean | undefined {
    return this.emailField.hasError('required') || this.passwordField.hasError('required');
  }

  get hasPatternError(): boolean | undefined {
    return this.emailField.hasError('pattern') || this.passwordField.hasError('pattern');
  }

  private resetPatternErrorOnInput(): void {
    combineLatest([this.emailField.valueChanges, this.passwordField.valueChanges]).subscribe(() => {
      if (this.hasPatternError) {
        this.dispatchErrors(null);
      }
    });
  }

  get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }
}
