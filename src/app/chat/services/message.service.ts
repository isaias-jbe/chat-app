import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AllMessagesQuery,
  CREATE_MESSAGE_MUTATION,
  GET_CHAT_MESSAGES_QUERY
} from './messages.graphql';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private apollo: Apollo) {}

  createMessage(message: {
    text: string;
    chatId: string;
    senderId: string;
  }): Observable<Message> {
    return this.apollo
      .mutate({
        mutation: CREATE_MESSAGE_MUTATION,
        variables: message
      })
      .pipe(map(res => res.data.createMessage));
  }

  /**
   * Busca as menssagens de um chat com base no se ID.
   * Retorna uma lista de mensagens.
   * @param chatId ID do Chat
   */
  getChatMessages(chatId: string): Observable<Message[]> {
    return this.apollo
      .query<AllMessagesQuery>({
        query: GET_CHAT_MESSAGES_QUERY,
        variables: { chatId }
      })
      .pipe(map(res => res.data.allMessages));
  }
}
