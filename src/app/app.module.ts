import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxFaceAvatarModule } from 'ngx-faceavatar';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NgxFaceAvatarModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
