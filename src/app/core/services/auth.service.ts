import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import {
  AUTHENTICATE_USER_MUTATION,
  SIGNUP_USER_MUTATION,
  LoggedInUserQuery,
  LOGGED_IN_USER_QUERY
} from './auth.graphql';
import { StorageKeys } from 'src/app/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Armasena a rota que o usuário tentou acessar sem estar logado
  redirectUrl: string;
  // Verifica se o usuário que permanecer logado
  keepSigned: boolean;
  private _isAuthenticated = new ReplaySubject<boolean>();

  constructor(private apollo: Apollo, private router: Router) {
    this.isAuthenticated.subscribe(is => console.log('AuthState: ', is));
    this.init();
  }

  /**
   * Ao realizar o login o metodo verifica se existe a chave 'agc-keep-signed'.
   * Está chave define se o usuário quer permanecer logado.
   * Não recebe parametros e não retorna nada. Apenas seta a variável
   * keepSigned para true/false
   */
  init(): void {
    this.keepSigned = JSON.parse(
      window.localStorage.getItem(StorageKeys.KEEP_SIGNED)
    );
  }

  /**
   * Responsavel por verificar se o usuário está Autenticado
   * Não recebe parametros.
   *
   * @returns boolean
   */
  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  /**
   * Realisa o login do usuário
   *
   * @param variables Objeto {email: string; password: string}
   */
  signinUser(variables: {
    email: string;
    password: string;
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: AUTHENTICATE_USER_MUTATION,
        variables
      })
      .pipe(
        map(res => res.data.authenticateUser),
        tap(res =>
          this.setAuthState({
            token: res && res.token,
            isAuthenticated: res !== null
          })
        ),
        catchError(error => {
          this.setAuthState({ token: null, isAuthenticated: false });
          return throwError(error);
        })
      );
  }

  /**
   * Realisa o cadastro dos usuário
   *
   * @param variables Objeto {name: string; email: string; password: string}
   */
  signupUser(variables: {
    name: string;
    email: string;
    password: string;
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: SIGNUP_USER_MUTATION,
        variables
      })
      .pipe(
        map(res => res.data.signupUser),
        tap(res =>
          this.setAuthState({
            token: res && res.token,
            isAuthenticated: res !== null
          })
        ),
        catchError(error => {
          this.setAuthState({ token: null, isAuthenticated: false });
          return throwError(error);
        })
      );
  }

  /**
   * Metodo para definir se o usuário que permanecer logado
   * Não rebe parametos e não tem retorno, apenas seta a
   * chave 'agc-keep-signed' do local storage para true/(false/null)
   */
  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    window.localStorage.setItem(
      StorageKeys.KEEP_SIGNED,
      this.keepSigned.toString()
    );
  }

  /**
   * Efetua o logout do usuário.
   */
  logoult(): void {
    window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
    window.localStorage.removeItem(StorageKeys.KEEP_SIGNED);
    this.keepSigned = false;
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
    this.apollo.getClient().resetStore();
  }

  /**
   * Verifica se o usuário ativou o login automatico.
   * Caso esteja ativo o metodo efetua o login automatico do usuário.
   */
  autoLogin(): Observable<void> {
    if (!this.keepSigned) {
      this._isAuthenticated.next(false);
      window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
      return of();
    }

    return this.validateToken().pipe(
      tap(authData => {
        const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
        this.setAuthState({
          token,
          isAuthenticated: authData.isAuthenticated
        });
      }),
      mergeMap(res => of()),
      catchError(error => {
        this.setAuthState({ token: null, isAuthenticated: false });
        return throwError(error);
      })
    );
  }

  /**
   * Metodo para validar o token do usuário.
   * Não recebe parametro.
   * @returns Observable<{id: string, isAuthenticated: boolean}>
   */
  private validateToken(): Observable<{
    id: string;
    isAuthenticated: boolean;
  }> {
    return this.apollo
      .query<LoggedInUserQuery>({
        query: LOGGED_IN_USER_QUERY
      })
      .pipe(
        map(res => {
          const user = res.data.loggedInUser;
          return {
            id: user && user.id,
            isAuthenticated: user !== null
          };
        })
      );
  }

  /**
   * Responsável por manipular a variável usada para verificar se o usuário
   * está autenticado na aplicação
   *
   * @param authData Objeto {token: string; isAuthenticated: boolean; }
   */
  private setAuthState(authData: {
    token: string;
    isAuthenticated: boolean;
  }): void {
    if (authData.isAuthenticated) {
      // Armazena o token no localStorage
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
    }
    this._isAuthenticated.next(authData.isAuthenticated);
  }
}
