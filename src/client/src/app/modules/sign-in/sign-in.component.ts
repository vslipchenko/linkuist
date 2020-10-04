import {Component, OnInit} from '@angular/core';
import {NavigationConfiguration, NavigationMainActionHref} from "../../models/components/navigation";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from "@angular/forms";
import {EMAIL_REGEXP, PASSWORD_REGEXP} from "../../constants/validation";
import {ErrorStateMatcher} from "@angular/material/core";
import {combineLatest} from "rxjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {SnackbarService} from "../../shared/services/snackbar/snackbar.service";

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  readonly navigationConfig: NavigationConfiguration = {
    mainActionHref: NavigationMainActionHref.HOME
  };

  signInForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private snackbarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.initSignInForm();
    this.resetPatternErrorOnInput();
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

  private initSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [SignInComponent.emailValidator]],
      password: ['', [SignInComponent.passwordValidator]]
    });
  }

  private resetPatternErrorOnInput(): void {
    combineLatest([this.emailField.valueChanges, this.passwordField.valueChanges]).subscribe(
      () => {
        if (this.hasPatternError) {
          this.dispatchErrors(null);
        }
      }
    );
  }

  private dispatchErrors(error: ValidationErrors | null): void {
    this.emailField.setErrors(error);
    this.passwordField.setErrors(error);
  }

  signIn(): void {
    this.signInForm.markAllAsTouched();
    if (this.signInForm.valid) {
      if (this.isInvalidUserData) {
        return this.dispatchErrors({pattern: true});
      }

      this.isSubmitting = true;
      const snackbar = this.snackbarService.showInfinite('Loading...');

      this.authenticationService.signIn(this.signInForm.value).subscribe(
        ({data}) => {
          this.isSubmitting = false;
          snackbar.dismiss();
          this.authenticationService.tokens = data;
        },
        (error) => {
          // TODO improve error handling
          console.log('error ', error);
          this.isSubmitting = false;
          snackbar.dismiss();
          this.snackbarService.showError();
        }
      );
    }
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
    const invalidPattern = invalidPasswordPattern || invalidEmailPattern;

    return invalidPattern;
  }

  get hasRequiredError(): boolean | undefined {
    return this.emailField.hasError('required') || this.passwordField.hasError('required');
  }

  get hasPatternError(): boolean | undefined {
    return this.emailField.hasError('pattern') || this.passwordField.hasError('pattern');
  }

  get customErrorStateMatcher(): ErrorStateMatcher {
    return { // email or password field touched and is empty OR one of them has pattern error
      isErrorState: (control) =>
        (control.touched && control.hasError('required'))
        || (this.passwordField.touched && this.passwordField.hasError('required'))
        || (control.hasError('pattern') || this.passwordField.hasError('pattern'))
    } as ErrorStateMatcher;
  }
}
