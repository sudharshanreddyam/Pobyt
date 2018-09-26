import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  
	pushMessage: string = 'push message will be displayed here';
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.pushMessage = this.navParams.get("message");
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad NotificationsPage');
	}
}
