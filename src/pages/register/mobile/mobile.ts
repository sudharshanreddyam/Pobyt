import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';
/**
 * Generated class for the MobilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile',
  templateUrl: 'mobile.html',
})
export class MobilePage {
	
	public mobileForm:FormGroup;
	public signUpData:UserRequest;
	public countryList:any='';
	public countryselected:any = "";

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public http:Http,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard,
    	public authProvider: AuthenticateProvider) {
			this.signUpData = this.navParams.get("signUpData");
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
		const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
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
  
  	userRegRequest(){
		console.log('signupdata from userrge request function');
		console.log(this.signUpData);
        this.signUpData.action = 'SIGNUP';
		if(this.signUpData.loginType == ""|| this.signUpData.loginType == undefined){
			this.signUpData.loginType = 'APP';
		}
		
        this.authProvider.login(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0009')) {
                this.signUpData.action ='OTP';
                this.signUpData.customerToken = success.customerToken;
                this.signUpData.userId = success.result.userId;
                this.navCtrl.push('OtpPage',{'signUpData':this.signUpData});
            }else {
                this.authProvider.showError(success.statusMessage);
            }
        },
        error => {
            this.authProvider.showError(error);
        });
    }
	
	onSubmit(){
		if(this.mobileForm.valid){
			this.authProvider.mobileOrEmailExist(this.signUpData).subscribe(success => {
	            if((success.status !== undefined)&&(success.status == '0001')) {
	            	this.userRegRequest();
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
