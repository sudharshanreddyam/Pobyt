import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Events } from 'ionic-angular';

/**
 * Generated class for the DurationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-duration',
  templateUrl: 'duration.html',
})
export class DurationPage {
  hotelInfo:any;
  stayDuration:any = {};
  stayDurationTemp:any;
  stayDurationInput:any;
  minDuration:any;
  oldPicker: boolean = false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private device: Device) {
  	this.hotelInfo = this.navParams.data;
    if((this.device.platform == "iOS") && (parseInt(this.device.version) < 11)){
      this.oldPicker = true;
      if(this.hotelInfo.minmumDurationPin <10){
          this.stayDurationInput = "0"+this.hotelInfo.minmumDurationPin+":00";
      }else{
          this.stayDurationInput = this.hotelInfo.minmumDurationPin+":00";
      }
      this.minDuration = this.stayDurationInput;
    }
    this.calculatefare({'hours':this.hotelInfo.minmumDurationPin,'mins':'00'});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DurationPage');
  }

	calculatefare(duration){
    if(this.oldPicker){
      this.stayDurationTemp = this.stayDurationInput;
      this.stayDurationTemp = this.stayDurationTemp.toString();
      this.stayDurationTemp = this.stayDurationTemp.split(":")
      this.stayDuration.hours = parseInt(this.stayDurationTemp[0]);
      this.stayDuration.mins = parseInt(this.stayDurationTemp[1]);
    }else{
      this.stayDuration = duration;
    }
    this.stayDuration.cost = this.hotelInfo.pricePerMin*this.stayDuration.hours*60;
    if(this.stayDuration.mins !== '00'){
      this.stayDuration.cost = this.stayDuration.cost+(this.hotelInfo.pricePerMin*this.stayDuration.mins);
    }
    let hotelChargewithTax = (this.stayDuration.cost+((this.stayDuration.cost*this.hotelInfo.taxPercentage)/100));
    let hotelChargewithTaxFinal = hotelChargewithTax + ((hotelChargewithTax*(this.hotelInfo.processingFeePercentage))/100); 
    this.stayDuration.youPay = parseFloat(hotelChargewithTaxFinal).toFixed(2);
    this.events.publish('user:stayDetails',this.stayDuration);
	}
}
