import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {APP_ID, Inject, NgModule, PLATFORM_ID} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'AngularUniversal'}),
      BrowserTransferStateModule,
      HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
            @Inject(PLATFORM_ID) private platformId: Object,
            @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
                'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId = ${appId}`);
    }
}
