import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Observable, of, Subject, throwError} from 'rxjs';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {catchError, finalize, first, retry, switchMap} from 'rxjs/operators';
import {extractGraphQLErrors} from '~app/utilities/graphql';
import {SnackbarService} from '~app/shared/services/snackbar/snackbar.service';
import {Router} from '@angular/router';

// TODO: determine logic to prevent token attach to the external service request
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  // it is required to have another token subject in
  // order to keep token data dependent UI components
  // to persist fulfilled state
  private readonly freshAccessToken$ = new Subject<string>();
  private isRefreshingAccessToken = false;

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router,
  ) {}

  private static attachAccessToken(
    request: HttpRequest<unknown>,
    accessToken: string,
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // const isRefreshingAccessToken = this.authenticationService.isRefreshingAccessToken;
    if (this.isRefreshingAccessToken) {
      console.log('Refreshing token');
      // if token is refreshing wait for a new value
      // proceed request chain if token was refreshed
      return this.freshAccessToken$.pipe(
        first((value) => Boolean(value)), // complete after first emit of truthy value
        switchMap((accessToken) => {
          return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken));
        }),
      );
    }

    const accessToken = this.authenticationService.accessToken;
    // attach current access token value to request
    return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken)).pipe(
      switchMap((response) => {
        // console.log('here ', response);
        if (response instanceof HttpResponse && response.body?.errors) {
          // look for graphql errors
          console.log('response is ', response);
          const errors = extractGraphQLErrors(response.body.errors);
          console.log('Intercepted graphql errors ', errors);
          for (const error of errors) {
            switch (error.code) {
              case 'ACCESS_TOKEN_EMPTY':
              case 'ACCESS_TOKEN_EXPIRED':
                // start token refresh process
                this.isRefreshingAccessToken = true;

                return this.authenticationService.refreshAccessToken().pipe(
                  // set new token value and attach it to next request (process further request)
                  retry(2), // retry twice on fail
                  first((value) => Boolean(value?.data?.accessTokenByRefreshToken)),
                  switchMap(({data: {accessTokenByRefreshToken}}) => {
                    this.freshAccessToken$.next(accessTokenByRefreshToken);
                    this.authenticationService.accessToken = accessTokenByRefreshToken;

                    return next.handle(
                      AuthenticationInterceptor.attachAccessToken(
                        request,
                        accessTokenByRefreshToken,
                      ),
                    );
                  }),
                  catchError((error) => {
                    // new token was not received
                    void this.router.navigate(['/sign-in']);
                    return throwError(error);
                  }), // always finish refresh token process
                  finalize(() => (this.isRefreshingAccessToken = false)),
                );
              case 'REFRESH_TOKEN_EMPTY':
              case 'REFRESH_TOKEN_INVALID':
              case 'ACCESS_TOKEN_INVALID':
                console.warn('LOG USER OUT');
                this.authenticationService.resetTokens();
                // let request initiator catch this error
                break;
              case 'USER_BLOCKED':
                console.warn('USER IS BLOCKED');
                this.snackbarService.showError(error.message);
                this.authenticationService.resetTokens();
                // let request initiator catch this error
                break;
            }
          }
        }
        // release stream
        return of(response);
      }),
      catchError((error: HttpErrorResponse) => {
        // Probably server error
        // setTimeout(() => {
        if (error.status > 499) {
          void this.router.navigate(['**'], {
            skipLocationChange: true,
            state: {statusCode: '50X'},
          });
        }
        // }, 3000);

        return throwError(error);
      }),
    );
  }
}
