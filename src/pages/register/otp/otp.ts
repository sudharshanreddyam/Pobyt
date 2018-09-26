import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { NativeStorage } from '@ionic-native/native-storage';
/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var SMS:any;
@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {

  public otpForm:FormGroup;
  public signUpData:UserRequest;
  public otp:string;

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
    public formBuilder: FormBuilder,
    public renderer:Renderer,
    public elementRef:ElementRef,
    public keyboard:Keyboard,
    public androidPermissions: AndroidPermissions,
    public authProvider: AuthenticateProvider,
    private nativeStorage: NativeStorage) {
    this.otp = "";
    this.signUpData = this.navParams.get("signUpData");
		this.otpForm = this.formBuilder.group({
		    otp: ['',Validators.compose([Validators.maxLength(6), Validators.pattern('[0-9]+'), Validators.required]),'']
		});
	}

  ionViewWillEnter()
  {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

  watchOTPSms(){
    if(SMS) SMS.startWatch(()=>{
      console.log('watching started');
    }, Error=>{
      console.log('failed to start watching');
    });
    document.addEventListener('onSMSArrive', (e:any)=>{
        if(e.data.body.indexOf('is your one time password(OTP) for phone verification') >= 0){
          this.otp = (e.data.body.match(/\d/g)).join('');
          this.onSubmit();
        }
    });
  }

  ionViewDidEnter() {
    const element = this.elementRef.nativeElement.querySelector('input');
    this.watchOTPSms();
      // we need to delay our call in order to work with ionic ...
      setTimeout(() => {
          this.renderer.invokeElementMethod(element, 'focus', []);
          this.keyboard.show();
      }, 500);
  }
  onClose(){
    this.navCtrl.pop();
  }
  ionViewWillLeave(){
    SMS.stopWatch(function(){console.log('Stoppig watching SMS');}, function(){});
  }
  onSubmit(){
    if(this.otpForm.valid){
        this.signUpData.action = 'OTP';
        this.signUpData.otp = parseInt(this.otp);
        delete this.signUpData.newPassword;
        delete this.signUpData.oldpassword;
        this.authProvider.login(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
                this.nativeStorage.setItem('loginType', {loginType: 'APP'});
                this.authProvider.setCurrentUser(success);
                this.authProvider.setUserData(success);
                this.navCtrl.setRoot('HomePage');
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
      this.signUpData.action = 'SIGNUP';
      this.signUpData.loginType = 'APP';
      delete this.signUpData.newPassword;
      delete this.signUpData.oldpassword;
      this.authProvider.login(this.signUpData).subscribe(success => {
          if((success.status !== undefined)&&(success.status == '0009')) {
              this.signUpData.action ='OTP';
              this.signUpData.customerToken = success.customerToken;
              this.signUpData.userId = success.result.userId;
          }else {
              this.authProvider.showError(success.statusMessage);
          }
      },
      error => {
          this.authProvider.showError(error);
      });
  }
}
