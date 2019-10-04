import { Inject, NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

import { Apollo, ApolloModule } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from 'src/environments/environment';
import {
  GRAPHCOOL_CONFIG,
  GraphcoolConfig
} from './core/providers/graphcool-config.provider';
import { StorageKeys } from './storage-keys';

@NgModule({
  imports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class ApolloConfigModule {
  constructor(
    private apollo: Apollo,
    @Inject(GRAPHCOOL_CONFIG) private graphcoolConfig: GraphcoolConfig,
    private httpLink: HttpLink
  ) {
    const uri = this.graphcoolConfig.simpleAPI;
    const http = httpLink.create({ uri });
    // Intercepta as requisições HTTP e adiciona o Headers e token
    const authMiddleware: ApolloLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getAuthToken()}`
        })
      });
      return forward(operation);
    });

    const linkError = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    });

    apollo.create({
      link: ApolloLink.from([linkError, authMiddleware.concat(http)]),
      cache: new InMemoryCache(),
      connectToDevTools: !environment.production
    });
  }

  private getAuthToken(): string {
    return window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
  }
}
