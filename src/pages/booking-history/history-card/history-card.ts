import { Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the HistoryCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'history-card',
  templateUrl: 'history-card.html'
})
export class HistoryCardComponent {

  text: string;
  @Input() booking;

  constructor(public navCtrl: NavController) {
    console.log('Hello HistoryCardComponent Component');
    this.text = 'Hello World';
  }

  BookingDetails(booking){
		this.navCtrl.push('BookingHistoryDetailsPage',{"bookingInfo":booking})
	}

}
