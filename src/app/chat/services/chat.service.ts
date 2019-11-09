import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/core/services/auth.service';
import {
  CHAT_BY_ID_OR_BY_USERS_QUERY,
  CREATE_PRIVATE_CHAT_MUTATION,
  USER_CHATS_QUERY,
  AllChatsQuery,
  ChatQuery
} from './chat.graphql';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apollo: Apollo, private authService: AuthService) {}

  /**
   * Busca todos os chats a partir do id usuario
   * @returns Chat[]
   */
  getUserChats(): Observable<Chat[]> {
    return this.apollo
      .query<AllChatsQuery>({
        query: USER_CHATS_QUERY,
        variables: {
          userId: this.authService.authUser.id
        }
      })
      .pipe(
        map(res => res.data.allChats),
        map((chats: Chat[]) => {
          const chatsToSort = chats.slice();

          return chatsToSort.sort((a, b) => {
            const valueA =
              a.messages.length > 0
                ? new Date(a.messages[0].createdAt).getTime()
                : new Date(a.createdAt).getTime();

            const valueB =
              b.messages.length > 0
                ? new Date(b.messages[0].createdAt).getTime()
                : new Date(b.createdAt).getTime();

            return valueB - valueA;
          });
        })
      );
  }

  /**
   * Busca um chat por id do chat ou por id de usuário
   * @param chatOrUserId Chat ou UserId
   */
  getChatsByIdOrByUsers(chatOrUserId: string): Observable<Chat> {
    return this.apollo
      .query<ChatQuery | AllChatsQuery>({
        query: CHAT_BY_ID_OR_BY_USERS_QUERY,
        variables: {
          chatId: chatOrUserId,
          loggedUserId: this.authService.authUser.id,
          targetUserId: chatOrUserId
        }
      })
      .pipe(map(res => (res.data.Chat ? res.data.Chat : res.data.allChats[0])));
  }

  /**
   * Metodo usado para criar um Chat privado.
   * Em um chat privado, o titulo será o nome do usuário
   * com que está converssando.
   * @param title titulo do chat, em um chat privado
   * @param targetUserId Id do usuário que recebera a mensagem
   */
  createPrivateChat(targetUserId: string): Observable<Chat> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRIVATE_CHAT_MUTATION,
        variables: {
          loggedUserId: this.authService.authUser.id,
          targetUserId
        }
      })
      .pipe(map(res => res.data.createChat));
  }
}
