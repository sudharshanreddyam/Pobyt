import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyNumberPage } from './verify-number';

@NgModule({
  declarations: [
    VerifyNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyNumberPage),
  ],
  exports: [
    VerifyNumberPage
  ]
})
export class VerifyNumberPageModule {}
