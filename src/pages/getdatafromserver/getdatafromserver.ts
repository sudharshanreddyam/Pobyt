import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { AuthenticateProvider} from '../../providers/authenticate/authenticate';
import {Http, Headers} from "@angular/http";


/**
 * Generated class for the GetdatafromserverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-getdatafromserver',
  templateUrl: 'getdatafromserver.html',
})
export class GetdatafromserverPage {
	citiesUnFiltered :any;
	cities :any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams, 
		public http: Http, 
		public authProvider: AuthenticateProvider, 
		public events: Events, 
		public viewCtrl: ViewController,) {
		if((this.authProvider.getCityList() != undefined)||(this.authProvider.getCityList() != null)){
        	this.cities = this.authProvider.getCityList();
        	this.citiesUnFiltered = this.cities;
        }
        http.get('assets/data/cities.json')
	    .subscribe(data => {
			data = data.json();
	    	let filteredData=[];
	    	for(let i=0; i< Object.keys(data).length;i++){
	    		filteredData[i] = data[i].name + ' , ' +data[i].state;
	    	}
			this.authProvider.hideLoading();
	      	this.authProvider.setCityList(filteredData);
			this.cities = this.authProvider.getCityList();
			this.citiesUnFiltered = this.cities;
	    });	    
	}

	selectedCity(city) {
		this.viewCtrl.dismiss(city);
	}
	
	searchCountry(searchbar) {
	  let q = searchbar.target.value;
	  if(q && q.trim() != ''){
		let unFilteredData = this.citiesUnFiltered;
		this.cities = unFilteredData.filter((v) => {
			if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
				return true;
			}
		})
	  }else{
	  	this.cities = this.citiesUnFiltered;
	  }
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GetdatafromserverPage');
	}
}
