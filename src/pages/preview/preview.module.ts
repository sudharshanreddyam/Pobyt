import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviewPage } from './preview';

@NgModule({
  declarations: [
    PreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(PreviewPage),
  ],
  exports: [
    PreviewPage
  ]
})
export class PreviewPageModule {}
