import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-tab',
  template: `
    <nav mat-tab-nav-bar backgroundColor="primary">
      <a
        mat-tab-link
        [routerLink]="['./']"
        routerLinkActive
        #chatsRoutLinkActive="routerLinkActive"
        [active]="chatsRoutLinkActive.isActive"
        [routerLinkActiveOptions]="{ exact: true }"
        >Chats</a
      >
      <a
        mat-tab-link
        [routerLink]="['users']"
        routerLinkActive
        #usersRoutLinkActive="routerLinkActive"
        [active]="usersRoutLinkActive.isActive"
        >Users</a
      >
    </nav>

    <router-outlet></router-outlet>
  `
})
export class ChatTabComponent {
  constructor() {}
}
