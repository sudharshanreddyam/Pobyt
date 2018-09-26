import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, } from '@angular/http';
import { AuthenticateProvider, UserRequest } from '../../providers/authenticate/authenticate';

/**
 * Generated class for the BookingHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-history',
  templateUrl: 'booking-history.html',
})
export class BookingHistoryPage {
	public bookingslist:any;
	public hideCard:any = false;
	public userInfo: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public authProvider: AuthenticateProvider) {
		var _this = this;
		this.getBookingHistory();
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad BookingHistoryPage');
	}

	inviteFriends(){
		this.navCtrl.push('InvitePage');
	}
	getBookingHistory(){
		this.userInfo = this.authProvider.getUserInfo();		
		let inputData:UserRequest = new UserRequest();
		inputData.customerToken = this.userInfo.customerToken;
		inputData.userId = this.userInfo.userId;
		let _this = this;
		this.authProvider.getBookingHistory(inputData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
				if(success.result !== undefined && success.result !== null){
					_this.bookingslist = success.result;
					var bookingKeys = Object.keys(_this.bookingslist);
					if(bookingKeys.length > 0){
						_this.hideCard = true;
					}else{
						_this.hideCard = false;
					}
				}else{
					_this.hideCard = false;					
				}
			}
		})
	}

}
