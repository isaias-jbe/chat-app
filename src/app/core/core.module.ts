import { NgModule } from '@angular/core';
import { ApolloConfigModule } from '../apollo-config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatListModule } from '@angular/material';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  exports: [
    ApolloConfigModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    NgxFileDropModule
  ]
})
export class CoreModule {}
