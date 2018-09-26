import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AmenitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amenities',
  templateUrl: 'amenities.html',
})
export class AmenitiesPage {
	hotelInfo:any;
	public amenities:any=[];
	// public amenities:any = [{img:'assets/amenities/2_people.png',text:'Max 2 people'},
	// 					{img:'assets/amenities/bed.png',text:'1 Queen bed'},
	// 					{img:'assets/amenities/restaurant.png',text:'Restaurant'},
	// 					{img:'assets/amenities/wifi.png',text:'Wifi'},
	// 					{img:'assets/amenities/swimming.png',text:'Swimming Pool'},
	// 					{img:'assets/amenities/glass.png',text:'Bar'},
	// 					{img:'assets/amenities/TV.png',text:'Television'},
	// 					{img:'assets/amenities/bath.png',text:'Shower'}						
	// 				];
		// "RESTAURANT","BAR","WIFI","AC","SHOWER","TELEVISION,SWIMMINGPOOL"
  constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.hotelInfo = this.navParams.data;
		for(var i=0; i<this.hotelInfo.amenities.length; i++){
			if(this.hotelInfo.amenities[i].toUpperCase() =='RESTAURANT'){
				this.amenities.push(
					{
						img:'assets/amenities/restaurant.png',text:'Restaurant'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='BAR'){
				this.amenities.push(
					{
						img:'assets/amenities/glass.png',text:'Bar'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='WIFI'){
				this.amenities.push(
					{
						img:'assets/amenities/wifi.png',text:'Wifi'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='AC'){
				this.amenities.push(
					{
						img:'assets/amenities/ac.png',text:'AC'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='SHOWER'){
				this.amenities.push(
					{
						img:'assets/amenities/bath.png',text:'Shower'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='TELEVISION'){
				this.amenities.push(
					{
						img:'assets/amenities/TV.png',text:'Television'
					}
				);
			}
			if(this.hotelInfo.amenities[i].toUpperCase() =='SWIMMINGPOOL'){
				this.amenities.push(
					{
						img:'assets/amenities/swimming.png',text:'Swimming Pool'
					}
				);
			}
		}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AmenitiesPage');
  }

}
