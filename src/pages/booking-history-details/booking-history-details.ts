import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BookingHistoryDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-history-details',
  templateUrl: 'booking-history-details.html',
})
export class BookingHistoryDetailsPage {
public booking:any;
public stayDuration:any = {};
public hotelphonenumber:any = '8143509343';
public pobytphonenumber:any = '8143509343';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.booking = this.navParams.get("bookingInfo");
    this.calculatefare(this.booking.numberOfMinutes)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingHistoryDetailsPage');
  }

  SendInvoice(){
  	alert('Invoice will be sent to your email shortly.');
  }
  OpenBookingPage(){
  	this.navCtrl.popToRoot();
  }

  calculatefare(duration){
    this.stayDuration.hours = (parseInt(duration)/60);
    this.stayDuration.mins = (parseInt(duration)%60);
    if(this.stayDuration.mins == 0){
      this.stayDuration.mins = this.stayDuration.mins + '0';
    }
  }

}
