import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HowitworksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-howitworks',
  templateUrl: 'howitworks.html'
})
export class HowitworksPage {
	slides =[
	     {
	        "image":"assets/hiw/screen1.png"
	     },
	     {
	        "image":"assets/hiw/screen2.png"
	     },
	     {
	     	"image":"assets/hiw/screen3.png"
	     },
	     {
	     	"image":"assets/hiw/screen4.png"
	     }
     ];

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad HowitworksPage');
	}

}
