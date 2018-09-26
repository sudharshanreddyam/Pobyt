import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the BookingModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-modal',
  templateUrl: 'booking-modal.html',
})
export class BookingModalPage {

  userFN : string;
  userLN : string;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.userFN = this.navParams.get('userFN');
    this.userLN = this.navParams.get('userLN');
  }
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingModalPage');
    console.log(this.userFN + ' ' + this.userLN);
  }
  
  accept() {
    this.viewCtrl.dismiss("accept");
  }

  others() {
    this.viewCtrl.dismiss("others");
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
