import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,AlertController } from 'ionic-angular';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the BookingConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-booking-confirm',
  templateUrl: 'booking-confirm.html',
})
export class BookingConfirmPage {
  public userInfo:any;
  public hotelInfo:any;
  public bookingName:any;
  public location:any;
  public bufferTime:any;
  public bufferTimeHours:any="00";
  public bufferTimeMinutes:any="00";
  public initialOffset:any;
  public hotelphonenumber: any = "8143509343";
	public interval;
	public paymentData;
	public amountPaid;
  constructor(public navCtrl: NavController, 
  	public alertCtrl: AlertController,
  	public navParams: NavParams,
  	private appAvailability: AppAvailability, 
  	public platform:Platform,
  	private iab: InAppBrowser,
  	private authProvider: AuthenticateProvider) {
  	this.userInfo = this.navParams.get("userInfo"); 
  	this.hotelInfo = this.navParams.get("hotelInfo"); 
	this.bookingName = this.navParams.get("bookingName"); 
	this.paymentData = this.navParams.get("paymentData");
	this.amountPaid = this.navParams.get("amountPaid");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingConfirmPage');
    this.location = {latitude:"17.446781",longitude:"78.383869", name:"Hotel_Avasa"}
    this.bufferTime = 60;
    //this.calculateTimerText(this.bufferTime);
    var time = this.bufferTime;
	this.initialOffset = 440;
	var i = this.bufferTime;

	/* Need initial run as interval hasn't yet occured... */
	var timerParent = document.getElementById('circle_parent');
	timerParent.style.strokeDashoffset = this.initialOffset;
	var timer = document.getElementById('circle_animation');
	timer.style.strokeDashoffset = (this.initialOffset-(this.bufferTime*(this.initialOffset/time))).toString();
	var env = this;
	env.calculateTimerText(i);
	this.interval = setInterval(function() {
		if (i == 1) {  	
	      clearInterval(this.interval);
				return;
	    }
	    timer.style.strokeDashoffset = (env.initialOffset-((i-1)*(env.initialOffset/time))).toString();
	    i--;
	    if(env.bufferTimeMinutes > 0){
	    	env.bufferTimeMinutes--;
	    	if(env.bufferTimeMinutes < 10){
	    		env.bufferTimeMinutes = '0' +env.bufferTimeMinutes;
	    	}
	    }else{
	    	env.calculateTimerText(i);
	    }
	}, 60000);
  }

  ionViewWillLeave(){
  	// clearInterval(this.interval);
  }
 
  startExternalMap() {
  	  let browserRef:any;
  	  let env = this;
	  if (this.location !==undefined) {
		this.authProvider.showLoading();
	    let position = this.authProvider.getUserInfo().location;
	    if(position){
			if (this.platform.is('ios')) {
			  this.appAvailability.check("comgooglemaps://")
			  .then(
			    (res) => {
			    	browserRef = window.open('maps://?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude, '_system')
			    },
	    		(error)=>{
	    			browserRef = this.iab.create('https://www.google.co.in/maps/place/?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude,'_system')
		    	}
			  );
			} else if (this.platform.is('android')) {
			  this.appAvailability.check("com.google.android.apps.maps")
			  .then(
			    (res) => {
			    	browserRef = window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + this.location.latitude + ',' + this.location.longitude + '(' + this.location.name + ')', '_system')
			    },
			    (error) => {
			    	browserRef = this.iab.create('https://www.google.co.in/maps/place/?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude,'_system')
			    }
			  );
			}else{
	        	browserRef = this.iab.create('https://www.google.co.in/maps/place/?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude,'_system');
	        };
	        setTimeout(function(){ env.authProvider.hideLoading(); }, 3000);
	    };
	  };
	}

	calculateTimerText(bufferTime){
		if(bufferTime >59){
			this.bufferTimeMinutes = (bufferTime%60);
			this.bufferTimeHours = Math.floor(bufferTime/60);
			if(this.bufferTimeHours < 10){
				this.bufferTimeHours = '0'+this.bufferTimeHours;
			}
			if(this.bufferTimeMinutes < 10){
				this.bufferTimeMinutes = '0'+this.bufferTimeMinutes;
			}
		}else{
			this.bufferTimeMinutes = bufferTime;
			this.bufferTimeHours = '00';
		}
	}

	popToHome(){
		console.log("poping to Home");
		this.navCtrl.popToRoot();
	}

	cancelBooking(){
		let env = this;
		let confirm = this.alertCtrl.create({
        message: 'Would you like to cancel the booking? Cancellation charges of 10% on the billed amount will be applicable.',
          buttons: [
              {
                  text: 'Yes',
                  handler: () => {
					console.log("Booking cancelled.");
					let refundObj:any = {};
					refundObj.paymentId = env.paymentData;
					refundObj.amountBeRefunded = env.amountPaid;
					env.authProvider.refundPayment(refundObj).subscribe(success => {
						console.log("Refund initiated succesfully");
						env.popToHome();
					},error => {
						env.authProvider.showError("Internal Server Error");
					});
                  }
              },
              {
                  text: 'No',
                  handler: () => {
                  	console.log("Stay calm");
                  }
              }
          ]
      });
      confirm.present();
	}
}
