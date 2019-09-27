import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, LoginModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
  /**
   * 1º nivel de injeção de dependencias
   * app.module -> CoreModule
   */
}
