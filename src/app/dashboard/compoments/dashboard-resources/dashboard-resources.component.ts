import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-resources',
  template: `
    <mat-nav-list>
      <a
        mat-list-item
        [routerLink]="[link.url]"
        *ngFor="let link of resources"
        (click)="onCloseSideNav()"
      >
        <mat-icon matListIcon>{{ link.icon }}</mat-icon>
        <h3 matLine>{{ link.title }}</h3>
      </a>

      <ng-content #logout></ng-content>
    </mat-nav-list>
  `
})
export class DashboardResourcesComponent implements OnInit {
  @Input() isMenu = false;
  @Output() closeSideNav = new EventEmitter<void>();

  resources: any[] = [
    {
      url: '/dashboard/chat',
      icon: 'chat_bubble',
      title: 'My Chat'
    }
  ];

  ngOnInit(): void {
    if (this.isMenu) {
      this.resources.unshift({
        url: '/dashboard',
        icon: 'home',
        title: 'Home'
      });
    }
  }

  onCloseSideNav(): void {
    this.closeSideNav.emit();
  }
}
