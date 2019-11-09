import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription, of } from 'rxjs';
import { map, mergeMap, tap, take } from 'rxjs/operators';

import { AuthService } from 'src/app/core/services/auth.service';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnDestroy, OnInit {
  chat: Chat;
  messages$: Observable<Message[]>;
  newMessage = '';
  recipientId: string = null;
  titleChat: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private messageServe: MessageService,
    private route: ActivatedRoute,
    private title: Title,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Carregando...');
    this.subscriptions.push(
      this.route.data
        .pipe(
          map(routeData => (this.chat = routeData.chat)),
          mergeMap(() => this.route.paramMap),
          tap((params: ParamMap) => {
            if (!this.chat) {
              this.recipientId = params.get('id');

              this.userService
                .getUserById(this.recipientId)
                .pipe(take(1))
                .subscribe((user: User) => this.title.setTitle(user.name));
              console.log('User id: ', this.recipientId);
              this.messages$ = of([]);
            } else {
              this.title.setTitle(this.chat.title || this.chat.users[0].name);
              this.messages$ = this.messageServe.getChatMessages(this.chat.id);
            }
          })
        )
        .subscribe(chat => console.log('meu chat: ', this.chat))
    );
  }

  /**
   * Metodo usado para enviar as mensagens do Chat.
   * Não recebe parametro e não retorna nada.
   */
  sendMessage(): void {
    // Usando o "trim" para remove espaços do início e do fim da string
    this.newMessage = this.newMessage.trim();
    if (this.newMessage) {
      if (this.chat) {
        this.messageServe
          .createMessage({
            text: this.newMessage,
            chatId: this.chat.id,
            senderId: this.authService.authUser.id
          })
          .pipe(take(1))
          .subscribe(console.log);
        this.newMessage = '';
      } else {
        this.createPrivateChat();
      }
    }
  }

  /**
   * Metodo usado para criar um Chat privado.
   * Não recebe parametro e não retorna nada.
   */
  private createPrivateChat(): void {
    this.chatService
      .createPrivateChat(this.recipientId)
      .pipe(
        take(1),
        tap((chat: Chat) => {
          this.chat = chat;
          this.sendMessage();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sbs => sbs.unsubscribe());
    this.title.setTitle('Angula & GraphQl');
  }
}
