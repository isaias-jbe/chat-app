import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ApolloConfigModule } from '../apollo-config.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  exports: [ApolloConfigModule, BrowserAnimationsModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule is already loaded. Import it in the AppModule only.
        (O CoreModule já está carregado. Importe-o apenas no AppModule.)`
      );
    }
  }
}
