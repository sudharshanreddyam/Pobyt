import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OldPasswordPage } from './oldpassword';

@NgModule({
  declarations: [
    OldPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(OldPasswordPage),
  ],
})
export class OldPasswordPageModule {}
