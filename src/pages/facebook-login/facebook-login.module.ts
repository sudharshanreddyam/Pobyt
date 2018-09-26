import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacebookLoginPage } from './facebook-login';

@NgModule({
  declarations: [
    FacebookLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(FacebookLoginPage),
  ],
  exports: [
    FacebookLoginPage
  ]
})
export class FacebookLoginPageModule {}