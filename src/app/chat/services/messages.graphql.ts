import graphql from 'graphql-tag';
import { Message } from '../models/message.model';

export interface AllMessagesQuery {
  allMessages: Message[];
}

/**
 * Mutation usada para inserir as mensagens no banco.
 * Recebe como parametor, o texto da mensagem, o id do chat e id do remente.
 * @param $text: String!
 * @param $chatId: ID!
 * @param $senderId: ID!
 */
export const CREATE_MESSAGE_MUTATION = graphql`
  mutation CreateMessageMutation($text: String!, $chatId: ID!, $senderId: ID!) {
    createMessage(text: $text, chatId: $chatId, senderId: $senderId) {
      id
      text
      createdAt
      sender {
        id
        name
        email
        createdAt
      }
      chat {
        id
      }
    }
  }
`;

/**
 * Query usada para listar as mensagens de um chat.
 * Recebe como parametor, o id do chat.
 * @param $chatId: ID!
 */
export const GET_CHAT_MESSAGES_QUERY = graphql`
  query GetChatMessagesQuery($chatId: ID!) {
    allMessages(filter: { chat: { id: $chatId } }, orderBy: createdAt_ASC) {
      id
      text
      createdAt
      sender {
        id
        name
        email
        createdAt
      }
      chat {
        id
      }
    }
  }
`;
