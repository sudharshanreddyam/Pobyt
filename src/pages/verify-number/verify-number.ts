import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { PasswordValidator } from  '../../validators/password';
import { AuthenticateProvider, UserRequest } from '../../providers/authenticate/authenticate';
import { Http } from '@angular/http';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the VerifyNumberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 declare var SMS:any;
@IonicPage()
@Component({
  selector: 'page-verify-number',
  templateUrl: 'verify-number.html',
})
export class VerifyNumberPage {
  public signUpData:UserRequest;
  public resetForm:FormGroup;
  public otpForm:FormGroup;
  public countryList:any='';
  public countryselected:any = "";
  public hideMobileScreen:boolean = false;
  public otp:string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    private authProvider: AuthenticateProvider,
    private http:Http,
    public renderer:Renderer,
    public elementRef:ElementRef,
    public keyboard:Keyboard,
    private nativeStorage: NativeStorage,
    public androidPermissions: AndroidPermissions) {
      this.signUpData = this.navParams.get("inputData");
      this.resetForm = this.formBuilder.group({
        contactNumber: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]+'), Validators.required]),''],
        password: ['',Validators.compose([Validators.required,Validators.minLength(5), Validators.maxLength(10)]),''],
        re_password: ['',Validators.compose([Validators.required]),'']
      }, { 'validator': PasswordValidator.isMatching });
      
      this.otp = "";
      this.otpForm = this.formBuilder.group({
        otp: ['',Validators.compose([Validators.maxLength(6), Validators.pattern('[0-9]+'), Validators.required]),'']
      });
      
      this.getCountries().then((data)=>{
        this.countryList = data;
        this.countryselected = this.countryList[0];
        this.signUpData.countryCode = this.countryList[0].countryCode;
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
  
  ionViewDidEnter() {
    this.watchOTPSms();
    const element = this.elementRef.nativeElement.querySelector('input');
      // we need to delay our call in order to work with ionic ...
      setTimeout(() => {
          this.renderer.invokeElementMethod(element, 'focus', []);
          this.keyboard.show();
      }, 500);
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
  
  generateOtp(){
    if(this.signUpData.action == 'FORGETPASSWORD'){
      this.signUpData.coutryCode = this.signUpData.countryCode;
      this.forgotPassword(this.signUpData);    
    }
  }
  
  reSendOtp(){
      this.otp = "";
      this.signUpData.action = 'FORGETPASSWORD';
      this.signUpData.loginType = 'APP';
      this.forgotPassword(this.signUpData);
  }
  
  forgotPassword(inputData){
    this.authProvider.forgotPassword(inputData).subscribe(success => {
      if((success.status !== undefined)&&(success.status == '0009')) {
        this.hideMobileScreen = true;
        this.signUpData.customerToken = success.customerToken;
      }else if((success.status !== undefined)&&(success.status == '0017')) {
          this.signUpData.action = 'SIGNIN';
          this.signUpData.loginType = 'APP';
          this.signUpData.password = this.signUpData.newPassword;
          this.loginWithMobile(this.signUpData);
      }else {
        this.authProvider.showError(success.statusMessage);
      }
    },
    error => {
      this.authProvider.showError(error);
    });
  }  
  
  loginWithMobile(inputData){
    this.authProvider.login(inputData).subscribe(success => {
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

  onSubmit(){
    this.signUpData.otp = parseInt(this.otp);
    this.signUpData.action = 'OTP';
    this.forgotPassword(this.signUpData)
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

}