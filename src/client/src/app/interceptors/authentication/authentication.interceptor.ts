import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, Subject, throwError} from 'rxjs';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {catchError, finalize, first, retry, switchMap, tap} from 'rxjs/operators';
import {shapeGraphQLErrors} from '../../utilities/graphql/graphql.utilities';
import {SnackbarService} from '../../shared/services/snackbar/snackbar.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  // it is required to have another token subject in
  // order to keep token data dependent UI components
  // to persist fulfilled state
  private readonly freshAccessToken$ = new Subject<string>();

  constructor(private authenticationService: AuthenticationService,
              private snackbarService: SnackbarService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isRefreshingAccessToken = this.authenticationService.isRefreshingAccessToken;
    console.log('is refreshing ', isRefreshingAccessToken);
    if (isRefreshingAccessToken) {
      // if token is refreshing wait for a new value
      // proceed request chain if token was refreshed
      return this.freshAccessToken$.pipe(
        first(value => !!value), // complete after first emit of truthy value
        switchMap(accessToken => {
          return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken));
        })
      );
    }

    const accessToken = this.authenticationService.accessToken;
    // attach current access token value to request
    return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken)).pipe(
      switchMap((response) => {
        if (response instanceof HttpResponse && response.body?.errors) {
          // look for graphql errors
          console.log('response is ', response);
          const errors = shapeGraphQLErrors(response.body.errors);
          console.log('Intercepted graphql errors ', errors);
          for (const error of errors) {
            switch (error.code) {
              case 'ACCESS_TOKEN_EMPTY':
              case 'ACCESS_TOKEN_EXPIRED':
                // subsequent API calls will wait until the new token has been retrieved
                this.freshAccessToken$.next(null);
                // start token refresh process
                this.authenticationService.isRefreshingAccessToken = true;
                this.authenticationService.refreshAccessToken()
                  .pipe( // set new token value and attach it to next request (process further request)
                    first(),
                    tap(({data: {accessTokenByRefreshToken}}) => {
                      this.freshAccessToken$.next(accessTokenByRefreshToken);
                      this.authenticationService.accessToken = accessTokenByRefreshToken;
                    }),
                    retry(2), // retry twice on fail
                    catchError(error => { // new token was not received
                      this.router.navigate(['/sign-in']);
                      return throwError(error);
                    }), // always finish refresh token process
                    finalize(() => this.authenticationService.isRefreshingAccessToken = false)
                  );
                break;
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
      })
    );
  }

  private static attachAccessToken(request: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: accessToken,
      },
    });
  }
}
