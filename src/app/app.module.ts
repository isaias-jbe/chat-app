// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from "@angular/core";

import { MatToolbarModule, MatListModule } from "@angular/material";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApolloConfigModule } from "./apollo-config.module";
import { gql } from "graphql-tag";

@NgModule({
  declarations: [AppComponent],
  imports: [
    // BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ApolloConfigModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
