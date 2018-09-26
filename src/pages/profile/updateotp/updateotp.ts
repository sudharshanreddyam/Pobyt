import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';

/**
 * Generated class for the UpdateOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updateotp',
  templateUrl: 'updateotp.html',
})
export class UpdateOtpPage {

  public otpForm:FormGroup;
  public signUpData:UserRequest;
  public otp:string;

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    public formBuilder: FormBuilder,
    public renderer:Renderer,
    public elementRef:ElementRef,
    public keyboard:Keyboard,
    public authProvider: AuthenticateProvider) {
		console.log('Hello UpdateOtpPage');
    this.otp = "";
    this.signUpData = this.navParams.get("signUpData");
		this.otpForm = this.formBuilder.group({
		    otp: ['',Validators.compose([Validators.maxLength(6), Validators.pattern('[0-9]+'), Validators.required]),'']
		});
	}

  ionViewDidEnter() {
    console.log('ionViewDidEnter UpdateOtpPage');
    const element = this.elementRef.nativeElement.querySelector('input');
      // we need to delay our call in order to work with ionic ...
      setTimeout(() => {
        console.log('UpdateOtpPage Focuser setTimeout');
          this.renderer.invokeElementMethod(element, 'focus', []);
          this.keyboard.show();
      }, 500);
  }

  onClose(){
    this.navCtrl.pop();
  }

  onSubmit(){
    if(this.otpForm.valid){
        this.signUpData.action = 'OTP';
        this.signUpData.otp = parseInt(this.otp);
        this.authProvider.changeContactNumber(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
                this.authProvider.getUserInfo().contactNumber = success.result.contactNumber;
                this.navCtrl.pop();
            }else {
                this.authProvider.showError(success.statusMessage);
            }
        },
        error => {
            this.authProvider.showError(error);
        });
    }
  }

  reSendOtp(){
      this.otp = "";
      this.userRegRequest();
  }

  userRegRequest(){
      this.signUpData.action = 'UPDATEMOBILE';
      this.authProvider.changeContactNumber(this.signUpData).subscribe(success => {
          if((success.status !== undefined)&&(success.status == '0009')) {
              console.log(success);
          }else {
              this.authProvider.showError(success.statusMessage);
          }
      },
      error => {
          this.authProvider.showError(error);
      });
  }

}
