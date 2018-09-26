import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingConfirmPage } from './booking-confirm';

@NgModule({
  declarations: [
    BookingConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingConfirmPage),
  ],
  exports: [
    BookingConfirmPage
  ]
})
export class BookingConfirmPageModule {}
