import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgResizableModule } from 'projects/ngresizable/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgResizableModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
