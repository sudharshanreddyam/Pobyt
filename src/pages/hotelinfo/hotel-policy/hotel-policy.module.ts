import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelPolicyPage } from './hotel-policy';

@NgModule({
  declarations: [
    HotelPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelPolicyPage),
  ],
})
export class HotelPolicyPageModule {}
