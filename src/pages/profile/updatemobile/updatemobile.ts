import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';

/**
 * Generated class for the UpdatemobilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatemobile',
  templateUrl: 'updatemobile.html',
})
export class UpdatemobilePage {

  public mobileForm:FormGroup;
	public signUpData:UserRequest;
	public countryList:any='';
	public countryselected:any = "";

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private viewCtrl: ViewController,
		public formBuilder: FormBuilder,
		public http:Http,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard,
    	public authProvider: AuthenticateProvider) {
			console.log('Hello MobileUpdatePage');
			this.signUpData = new UserRequest();
			this.mobileForm = this.formBuilder.group({
				contactNumber: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]+'), Validators.required]),'']
			});
			this.getCountries().then((data)=>{
			this.countryList = data;
			this.countryselected = this.countryList[0];
			this.signUpData.countryCode = this.countryList[0].countryCode;
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter MobileUpdatePage');
		const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
	    	console.log('MobileUpdatePage Focuser setTimeout');
	        this.renderer.invokeElementMethod(element, 'focus', []);
	        this.keyboard.show();
	    }, 500);
	}
	
	getCountries(){
        return new Promise(resolve =>{
            this.http.get(`assets/data/countries.json`)
            .subscribe(res => resolve(res.json()));
        });
    }

    selectCountry(){
        document.getElementById('selectTag').click();
    }
	
	optionSelected(){
		this.signUpData.countryCode =  this.countryselected.countryCode;
	}
    
    onClose(){
    	this.navCtrl.pop();
  	}
	
	onSubmit(){
		if(this.mobileForm.valid){
			this.signUpData.action = 'UPDATEMOBILE';
    		this.signUpData.customerToken = this.authProvider.getUserInfo().customerToken;
        	this.signUpData.userId = this.authProvider.getUserInfo().userId;        
			this.authProvider.changeContactNumber(this.signUpData).subscribe(success => {
	            if((success.status !== undefined)&&(success.status == '0009')) {
	            	this.navCtrl.push('UpdateOtpPage',{'signUpData':success.result}).then(() => {
						// first we find the index of the current view controller:
						const index = this.viewCtrl.index;
						// then we remove it from the navigation stack
						this.navCtrl.remove(index);
					});
	            }else {
	                this.authProvider.showError(success.statusMessage);
	            }
	        },
	        error => {
	            this.authProvider.showError(error);
	        });
		}
	}

}
