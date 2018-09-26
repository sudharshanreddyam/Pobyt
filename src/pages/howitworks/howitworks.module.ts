import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowitworksPage } from './howitworks';

@NgModule({
  declarations: [
    HowitworksPage,
  ],
  imports: [
    IonicPageModule.forChild(HowitworksPage),
  ],
  exports: [
    HowitworksPage
  ]
})
export class HowitworksPageModule {}
