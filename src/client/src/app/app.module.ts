import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {SNACKBAR_CONFIG} from './constants/snackbar';
import {SharedModule} from './shared/shared.module';
import {AuthenticationInterceptor} from './interceptors/authentication/authentication.interceptor';
import {GraphQLModule} from './graphql/graphql.module';
import {AuthenticationService} from './services/authentication/authentication.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {DIALOG_CONFIG} from './constants/dialog';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    GraphQLModule,
    MatSnackBarModule,
    SharedModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACKBAR_CONFIG},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_CONFIG},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: AuthenticationFactory, deps: [AuthenticationService, Router], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// TODO create & move to specific folder
function TranslateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

function AuthenticationFactory(authenticationService: AuthenticationService, router: Router): () => Promise<boolean> {
  return () => new Promise((resolve) => {
    const refreshToken = authenticationService.refreshToken;

    if (refreshToken) {
      authenticationService.refreshAccessToken().pipe(
        first()
      ).subscribe(
        ({data: {accessTokenByRefreshToken}}) => {
          authenticationService.accessToken = accessTokenByRefreshToken;
          return resolve(true);
        },
        () => {
          authenticationService.resetTokens();
          router.navigate(['/']);
          return resolve(true);
        }
      );
    } else {
      return resolve(true);
    }
  });
}
