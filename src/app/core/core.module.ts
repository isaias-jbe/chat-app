import { NgModule } from '@angular/core';
import { ApolloConfigModule } from '../apollo-config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatListModule } from '@angular/material';

@NgModule({
  exports: [
    ApolloConfigModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule
  ]
})
export class CoreModule {}
