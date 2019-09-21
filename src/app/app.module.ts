import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [AppComponent, FileUploadComponent],
  imports: [CoreModule],
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
