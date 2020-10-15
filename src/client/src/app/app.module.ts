import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {SNACKBAR_CONFIG} from './constants/snackbar';
import {SharedModule} from "./shared/shared.module";
import {Apollo} from "apollo-angular";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {Environment} from "../environments/environment.dev";
import {InMemoryCache} from "@apollo/client/core";
import {HttpLink} from "apollo-angular/http";
import {onError} from "@apollo/client/link/error";
import {shapeGraphQLErrors} from "./utilities/graphql/graphql.utilities";
import {Router} from "@angular/router";
import {first, map} from "rxjs/operators";

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
    MatSnackBarModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: setApolloClient,
      deps: [
        HttpLink,
        Apollo,
        AuthenticationService,
        Router
      ],
      multi: true
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACKBAR_CONFIG},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
// TODO create & move to specific folder
function TranslateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

function setApolloClient(
  httpLink: HttpLink,
  apollo: Apollo,
  authenticationService: AuthenticationService,
  router: Router
) {
  return () => {
    const errorLink = onError( // TODO add 'INTERNAL_SERVER_ERROR' handler
      ({
         response,
         graphQLErrors
       }) => {
        console.log('graphQLErrors ', graphQLErrors);
        if (graphQLErrors) {
          shapeGraphQLErrors(graphQLErrors).forEach(error => {
            switch (error.code) {
              case 'ACCESS_TOKEN_EMPTY':
              case 'ACCESS_TOKEN_EXPIRED':
                console.log('recovering');
                authenticationService.recoverAccessToken().pipe(
                  first()
                ).subscribe(({data: {accessTokenByRefreshToken}}) => {
                  console.log(accessTokenByRefreshToken);
                  authenticationService.accessToken = accessTokenByRefreshToken;
                });
                // suppress error logging
                response.errors = null;
                return;
              case 'REFRESH_TOKEN_EMPTY':
              case 'REFRESH_TOKEN_INVALID':
              case 'ACCESS_TOKEN_INVALID':
                authenticationService.resetTokens();
                response.errors = null;
                return router.navigate(['/sign-in']);
              // TODO user blocked
            }
          });
        }
      });

    const createLink = httpLink.create({
      uri: Environment.graphqlUri,
      headers: new HttpHeaders({
        Authorization: authenticationService.accessToken
      })
    });

    apollo.create({
      link: errorLink.concat(createLink),
      cache: new InMemoryCache()
    });
  };
}
