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
    const errorLink = onError(
      ({
         response,
         graphQLErrors
       }) => {
        console.log('graphQLErrors ', graphQLErrors);
        if (graphQLErrors) {
          shapeGraphQLErrors(graphQLErrors).forEach(error => {
            switch (error.code) {
              case 'TOKEN_EMPTY':
                break;
            }
          });
        }

        response.errors = null;
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
