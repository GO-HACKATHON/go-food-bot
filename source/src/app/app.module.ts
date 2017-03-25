import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


import {
  Component,
  OnsenModule,
  CUSTOM_ELEMENTS_SCHEMA
} from 'angular2-onsenui';


@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OnsenModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
