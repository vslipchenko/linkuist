import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {SNACKBAR_CONFIG} from '~app/constants/snackbar';
import {SharedModule} from '~app/shared/shared.module';
import {AuthenticationInterceptor} from '~app/interceptors/authentication/authentication.interceptor';
import {GraphQLModule} from '~app/graphql/graphql.module';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {DIALOG_CONFIG} from '~app/constants/dialog';
import {ApolloQueryResult} from '@apollo/client/core';
import {ClientPresetQueryResult} from '~app/types/shared/shared.interfaces';
import {DateService} from '~app/shared/services/date/date.service';
import {PresetService} from '~app/services/preset/preset.service';
import {StoreModule} from '@ng-estate/store';
import {AppStore} from '~app/store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(AppStore),
    AppRoutingModule,
    GraphQLModule,
    MatSnackBarModule,
    SharedModule,
    TranslateModule.forRoot(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: translateLoaderFactory('app'),
    //     deps: [HttpClient],
    //   },
    //   isolate: true,
    // }),
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACKBAR_CONFIG},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_CONFIG},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {
      provide: APP_INITIALIZER,
      useFactory: authenticationFactory,
      deps: [AuthenticationService, Router],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: clientPresetFactory,
      // deps: [AuthenticationService, SharedService],
      deps: [PresetService, DateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function authenticationFactory(
  authenticationService: AuthenticationService,
  router: Router,
): () => Promise<void> {
  return (): Promise<void> =>
    new Promise((resolve) => {
      const refreshToken = authenticationService.refreshToken;

      if (!refreshToken) return resolve();

      authenticationService
        .refreshAccessToken()
        // .pipe(take(1))
        .subscribe(
          ({data: {accessTokenByRefreshToken}}) => {
            authenticationService.accessToken = accessTokenByRefreshToken;
            resolve();
          },
          () => {
            authenticationService.resetTokens();
            void router.navigate(['/']);
            resolve();
          },
        );
    });
}

function clientPresetFactory(
  // authenticationService: AuthenticationService,
  presetService: PresetService,
  dateService: DateService,
): () => Promise<void> {
  return (): Promise<void> =>
    new Promise((resolve) => {
      // const refreshToken = authenticationService.refreshToken;
      //
      // if (!refreshToken) return resolve();
      //
      // authenticationService.accessToken$
      //   .pipe(
      //     filter((value) => Boolean(value)),
      //     take(1), // Access token is set
      //     switchMap(() => sharedService.getClientPreset()),
      //   )
      //   .subscribe(
      //     ({data: {clientPreset}}: ApolloQueryResult<ClientPresetQueryResult>) => {
      //       debugger;
      //       resolve();
      //     },
      //     () => {
      //       resolve();
      //     },
      //   );
      // const clientTimestampBeforeRequest = new Date().getTime();

      presetService
        .getClientPreset()
        // .pipe(take(1))
        .subscribe(
          ({data: {clientPreset}}: ApolloQueryResult<ClientPresetQueryResult>) => {
            // dateService.adjustServerUtcTimestamp(
            //   clientTimestampBeforeRequest,
            //   clientPreset.serverUtcTimestamp,
            // );
            dateService.serverUtcTimestamp = clientPreset.serverUtcTimestamp;
            resolve();
          },
          () => {
            resolve();
          },
        );
    });
}
