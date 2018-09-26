import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, } from '@angular/http';

/**
 * Generated class for the PromotionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-promotions',
  templateUrl: 'promotions.html',
})
export class PromotionsPage {
	public promotionsList:any;
	public hideCard:any = true;	

	constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
	  	var _this = this;
		this.getPromotionsAvailable().then(function(res){
			_this.promotionsList = res;
			// var bookingKeys = Object.keys(_this.promotionsList);
			// if(bookingKeys.length > 0){
			// 	_this.hideCard = true;
			// }else{
			// 	_this.hideCard = false;
			// }
		})
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionsPage');
  }

	getPromotionsAvailable(){
		return new Promise(resolve =>{
	      this.http.get(`assets/data/Promotions.json`)
	      .subscribe(res => resolve(res.json()));
	    });
	}
	ApplyPromo(code){
		//this.navCtrl.popTo("");
	}
	inviteFriends(){
		this.navCtrl.push("InvitePage");	
	}
}
