import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationMainActionType} from '~app/types/navigation/navigation.enums';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {EMAIL_REGEXP, PASSWORD_REGEXP} from '~app/constants/regexps';
import {ErrorStateMatcher} from '@angular/material/core';
import {combineLatest} from 'rxjs';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {SnackbarService} from '~app/shared/services/snackbar/snackbar.service';
import {ApolloError} from '@apollo/client/core';
import {shapeGraphQLErrors} from '~app/utilities/graphql';
import {ProgressBarService} from '~app/shared/services/progress-bar/progress-bar.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  public signInForm: FormGroup | undefined;
  public hidePassword = true;
  public isSubmitting = false;

  public constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbarService: SnackbarService,
    private readonly progressBarService: ProgressBarService,
    private readonly router: Router, // private readonly translateService: TranslateService, // private readonly appTranslateService: AppTranslateService,
  ) {}

  public get customErrorStateMatcher(): ErrorStateMatcher {
    return {
      // email or password field touched and is empty OR one of them has pattern error
      isErrorState: (control: AbstractControl) =>
        (control?.touched && control.hasError('required')) ||
        (this.passwordField?.touched && this.passwordField.hasError('required')) ||
        control?.hasError('pattern') ||
        this.passwordField?.hasError('pattern'),
    } as any; // TODO replace with ErrorStateMatcher
  }

  public get hasRequiredError(): boolean | undefined {
    return this.emailField?.hasError('required') || this.passwordField?.hasError('required');
  }

  public get hasPatternError(): boolean | undefined {
    return this.emailField?.hasError('pattern') || this.passwordField?.hasError('pattern');
  }

  public get navigationMainActionType(): NavigationMainActionType {
    return this.authenticationService.isUserAuthenticated
      ? NavigationMainActionType.PROFILE
      : NavigationMainActionType.HOME;
  }

  private get emailField(): AbstractControl | null | undefined {
    return this.signInForm?.get('email');
  }

  private get passwordField(): AbstractControl | null | undefined {
    return this.signInForm?.get('password');
  }

  private get isInvalidUserData(): boolean {
    const invalidPasswordPattern = !PASSWORD_REGEXP.test(this.passwordField?.value);
    const invalidEmailPattern = !EMAIL_REGEXP.test(this.emailField?.value);

    return invalidPasswordPattern || invalidEmailPattern;
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

  public ngOnInit(): void {
    // this.appTranslateService.setupTranslate(this.translateService);
    this.initSignInForm();
    this.resetPatternErrorOnInput();
    // this.authenticationService.mock().subscribe();
    // console.log(this.authenticationService.accessTokenData);
  }

  public signIn(): void {
    this.signInForm?.markAllAsTouched();
    if (this.signInForm?.valid) {
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
            const username = this.authenticationService.accessTokenData?.username;

            if (username) {
              void this.router.navigate([`@${username}`]);
            }
          },
          ({graphQLErrors}: ApolloError) => {
            const errors = shapeGraphQLErrors(graphQLErrors);
            // console.log('errors ', graphQLErrors, errors);

            errors.forEach((error) => {
              switch (error.code) {
                case 'BAD_USER_INPUT':
                  this.dispatchErrors({pattern: true});
                  return this.changeDetector.detectChanges();
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
    this.emailField?.setErrors(error);
    this.passwordField?.setErrors(error);
  }

  private initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [SignInComponent.emailValidator.bind(this)]],
      password: ['', [SignInComponent.passwordValidator.bind(this)]],
    });
  }

  private resetPatternErrorOnInput(): void {
    combineLatest([this.emailField?.valueChanges, this.passwordField?.valueChanges]).subscribe(
      () => {
        if (this.hasPatternError) {
          this.dispatchErrors(null);
        }
      },
    );
  }
}
