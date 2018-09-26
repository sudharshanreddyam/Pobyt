import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage,MapPage,HotelsliderPage } from '../pages';

@NgModule({
  declarations: [
    HomePage,
	  MapPage,
	  HotelsliderPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage,
	  MapPage,
	  HotelsliderPage
  ]
})
export class HomePageModule {}
