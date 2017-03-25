import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {MaterialModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';


import "hammerjs";
import { ChatMessageComponent } from './chat-message/chat-message.component';


import {
  Component,
  OnsenModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from 'angular2-onsenui';

@NgModule({
  declarations: [
    AppComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    MaterialModule,
    FlexLayoutModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class AppModule { }
