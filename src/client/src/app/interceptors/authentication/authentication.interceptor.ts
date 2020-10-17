import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {NEVER, Observable, Subject} from 'rxjs';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {catchError, finalize, first, switchMap} from "rxjs/operators";
import {shapeGraphQLErrors} from "../../utilities/graphql/graphql.utilities";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  // it is required to have another token subject in
  // order to keep token data dependent UI components
  // to persist fulfilled state
  private readonly freshAccessToken$ = new Subject<string>();

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isRefreshingAccessToken = this.authenticationService.isRefreshingAccessToken;
    console.log('is refreshing ', isRefreshingAccessToken);
    if (isRefreshingAccessToken) {
      // if token is refreshing wait for a new value
      // proceed request chain if token was refreshed, abort request otherwise
      console.log('in progress ', request);
      return this.freshAccessToken$.pipe(
        first(value => !!value), // complete after first emit of truthy value
        switchMap(accessToken => {
          console.log('here');
          // if (!accessToken) {
          //   return NEVER;
          // }

          return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken));
        })
      );
    }

    const accessToken = this.authenticationService.accessToken;
    // attach current access token value to request
    return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken)).pipe(
      switchMap(result => {
        console.log(result);
        if (result instanceof HttpResponse) {
          // look for graphql errors
          let errors = result.body.errors;

          if (errors) {
            errors = shapeGraphQLErrors(errors);
            console.log('Intercepted graphql errors ', errors);
            errors.forEach(error => {
              switch (error.code) {
                case 'ACCESS_TOKEN_EMPTY':
                case 'ACCESS_TOKEN_EXPIRED':
                  // subsequent API calls will wait until the new token has been retrieved
                  // this.authenticationService.accessToken = '';
                  this.freshAccessToken$.next(null);
                  // start token refresh process
                  this.authenticationService.isRefreshingAccessToken = true;
                  return this.authenticationService.refreshAccessToken()
                    .pipe( // set new token value and attach it to next request (process further request)
                      first(),
                      switchMap(({data: {accessTokenByRefreshToken}}) => {
                        this.freshAccessToken$.next(accessTokenByRefreshToken);
                        this.authenticationService.accessToken = accessTokenByRefreshToken;
                        return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessTokenByRefreshToken));
                      }),
                      catchError(() => { // new token was not received
                        this.authenticationService.logOut();
                        return NEVER;
                      }), // always finish refresh token process
                      finalize(() => this.authenticationService.isRefreshingAccessToken = false)
                    )
                case 'REFRESH_TOKEN_EMPTY':
                case 'REFRESH_TOKEN_INVALID':
                case 'ACCESS_TOKEN_INVALID':
                  console.warn('LOG USER OUT');
                  return this.authenticationService.logOut();
              }
            })
          }
        }

        return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken));
      })
    );
    // return next.handle(request);
  }

  // private handleGraphQLErrors(errors): {
  //
  // }

  private static attachAccessToken(request: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: accessToken,
      },
    });
  }
}
