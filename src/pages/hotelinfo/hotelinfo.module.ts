import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelinfoPage } from './hotelinfo';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    HotelinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelinfoPage),
    SuperTabsModule
  ],
  exports: [
    HotelinfoPage
  ]
})
export class HotelinfoPageModule {}
