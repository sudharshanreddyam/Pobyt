import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingHistoryDetailsPage } from './booking-history-details';

@NgModule({
  declarations: [
    BookingHistoryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingHistoryDetailsPage),
  ],
})
export class BookingHistoryDetailsPageModule {}
