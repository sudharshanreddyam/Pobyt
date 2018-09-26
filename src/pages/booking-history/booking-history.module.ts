import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingHistoryPage } from './booking-history';
import { HistoryCardComponent } from './history-card/history-card';

@NgModule({
  declarations: [
    BookingHistoryPage,
    HistoryCardComponent
  ],
  imports: [
    IonicPageModule.forChild(BookingHistoryPage),
  ],
})
export class BookingHistoryPageModule {}
