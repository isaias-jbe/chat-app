import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import {
  ALL_USERS_QUERY,
  AllUsersQuery,
  UserQuery,
  GET_USER_BY_ID_QUERY
} from './user.graphql';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apollo: Apollo) {}

  /**
   * Metodo que busca um usuario pelo ID
   * Retorna um Objeto do usuário
   * @param $userId: ID!
   * @returns User
   */
  getUserById(userId: string): Observable<User> {
    return this.apollo
      .query<UserQuery>({
        query: GET_USER_BY_ID_QUERY,
        variables: { userId }
      })
      .pipe(map(res => res.data.User));
  }

  /**
   * Metodo que busca uma lista de usuarios
   * recebe como parametro o ID do usuário que está logado
   * para que ele não venha na lista.
   * Retorna um lista de objetos de usuários
   * @param $idToExclude: ID!
   * @returns User[]
   */
  allUsers(idToExclude: string): Observable<User[]> {
    return this.apollo
      .query<AllUsersQuery>({
        query: ALL_USERS_QUERY,
        variables: {
          idToExclude
        }
      })
      .pipe(map(res => res.data.allUsers));
  }
}
