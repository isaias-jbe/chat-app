import { User } from '../models/user.model';
import graphql from 'graphql-tag';

export interface UserQuery {
  User: User;
}

export interface AllUsersQuery {
  allUsers: User[];
}

/**
 * Query que busca um usuario pelo ID
 * @param $userId: ID!
 * @returns User
 */
export const GET_USER_BY_ID_QUERY = graphql`
  query GetUserByIdQuery($userId: ID!) {
    User(id: $userId) {
      id
      name
      email
      createdAt
    }
  }
`;

/**
 * Query que busca uma lista de usuarios
 * recebe como parametro o ID do usuário que está logado
 * para que ele não venha na lista.
 * @param $idToExclude: ID!
 * @returns User[]
 */
export const ALL_USERS_QUERY = graphql`
  query AllUsersQuery($idToExclude: ID!) {
    allUsers(orderBy: name_ASC, filter: { id_not: $idToExclude }) {
      id
      name
      email
      createdAt
    }
  }
`;
