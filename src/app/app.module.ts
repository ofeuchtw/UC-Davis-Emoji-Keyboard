import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PopupComponent } from './popup/popup.component';
import { EmojiComponent } from './emoji/emoji.component';



@NgModule({
  declarations: [
      AppComponent,
      PopupComponent,
      EmojiComponent,
  ],
  imports: [
      BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
