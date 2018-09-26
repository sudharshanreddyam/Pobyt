import { Component, Injectable, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, NavController, Platform} from 'ionic-angular';
import { AuthenticateProvider,UserRequest } from '../../providers/authenticate/authenticate';
import { NativeStorage } from '@ionic-native/native-storage';
import { FacebookLoginService,GoogleLoginService } from '../../providers/providers';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    loginForm:FormGroup;
    submitAttempt:boolean=false;
    keyboardon: boolean = false;
    readonly Branch:any = window['Branch'];
    userCredentials = { emailId: '',mobileNumber: '',password:'' };
    constructor(public navCtrl: NavController,
            private authProvider: AuthenticateProvider,
            public facebookLoginService: FacebookLoginService,
            public googleLoginService: GoogleLoginService,
            public formBuilder:  FormBuilder,
            public keyboard:Keyboard,
            public chRef : ChangeDetectorRef,
            private platform : Platform,
            private nativeStorage: NativeStorage
           ) {
        this.loginForm = this.formBuilder.group({
            username: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('^[0-9]+$'), Validators.required]),''],
            password: ['',Validators.compose([Validators.maxLength(10),Validators.required]),'']
        });
        this.keyboard.onKeyboardShow().subscribe(success =>{
            setTimeout(()=>{
                this.keyboardon = true;
                this.chRef.detectChanges();
                console.log(success); }, 0)
        });
        this.keyboard.onKeyboardHide().subscribe(success =>{
            setTimeout(()=>{
                this.keyboardon = false;
                this.chRef.detectChanges();
                console.log(success); }, 0)
        });
    }
    doFacebookLogin() {
        this.authProvider.showLoading();
        let env = this;
        this.facebookLoginService.doFacebookLogin()
            .then(function(res){
                let inputData:UserRequest = new UserRequest();
                inputData.action = "SIGNIN";
                inputData.loginType = "FB";
                inputData.emailId = res.email;
                if((res.gender !== undefined)&&(res.gender !== null)){
                    inputData.gender = res.gender;
                }
                inputData.firstName= res.first_name;
                inputData.lastName= res.last_name;
                inputData.profilePicture = "https://graph.facebook.com/" + res.id + "/picture?type=large";
                env.authenticate(inputData);
        }, function(err){
            env.authProvider.hideLoading();
            //console.log("Facebook Login error", err);
            env.authProvider.showError("Facebook Login error");
        });
    }

    forgetPassword(){
        let inputData = new UserRequest();
        inputData.action = 'FORGETPASSWORD';
        this.navCtrl.push('VerifyNumberPage',{'inputData':inputData,'screen':'forgotpassword'});
    }

    doGoogleLogin() {
        this.authProvider.showLoading();
        let env = this;
        this.googleLoginService.doGoogleLogin()
            .then(function(res){
                let inputData:UserRequest = new UserRequest();
                inputData.action = "SIGNIN";
                inputData.loginType = "GMAIL";
                inputData.emailId = res.email;
                inputData.firstName = res.givenName;
                inputData.profilePicture = res.image;
                env.authenticate(inputData);
        }, function(err){
            env.authProvider.hideLoading();
            //console.log("Google Login error", err);
            env.authProvider.showError("Google Login error");
        });
    }

    SignUp() {
        this.navCtrl.push('NamePage');
    }

    SignIn() {
        this.submitAttempt = true;
        if(this.loginForm.valid){
            let mobileRegex = /^[0-9]+$/;
            let inputData:UserRequest = new UserRequest();
            inputData.action = "SIGNIN";
            inputData.emailId = this.userCredentials.emailId;
            inputData.contactNumber = this.userCredentials.mobileNumber;
            inputData.loginType = "APP";
            inputData.password = this.userCredentials.password;
            //inputData.profilePicture = this.userCredentials.profileimage;
            if(inputData.emailId.match(mobileRegex)){
                inputData.contactNumber = this.userCredentials.emailId;
                inputData.emailId = '';
            }
            this.authenticate(inputData);
        }
    }

    authenticate(inputData){
        this.authProvider.login(inputData).subscribe(success => {
            console.log('the success returned from authenticate');
            console.log(success);
            if((success.status !== undefined)&&(success.status == '0001')) {
                this.nativeStorage.setItem('loginType', {loginType: inputData.loginType});
                this.authProvider.setCurrentUser(success);
                this.authProvider.setUserData(success);
                this.navCtrl.setRoot('HomePage');
                if (this.platform.is('cordova')) {
                  this.Branch.setIdentity(inputData.contactNumber).then(function (res) {
                    console.log('Response: ' + JSON.stringify(res))
                  }).catch(function (err) {
                    console.log('Error: ' + JSON.stringify(err.message))
                  });
                }
            }else if((success.status !== undefined)&&(success.status == '0013')) {
                if(inputData.loginType == 'APP'){
                    this.authProvider.showError(success.statusMessage);
                }else{
                    inputData.action ='SIGNUP';
                    if(inputData.profilePicture == null){
                        inputData.profilePicture="";
                    }
                    console.log('login type sent to mobile page');
                    console.log(inputData.loginType);
                    this.navCtrl.push('MobilePage',{'signUpData':inputData,'screen':'mobile'});
                }
            }else if((success.status !== undefined)&&(success.status == '0009')) {
                inputData.action ='OTP';
                inputData.customerToken = success.customerToken;
                inputData.userId = success.result.userId;
                this.navCtrl.push('MobilePage',{'signUpData':inputData,'screen':'otp'});
            }else {
                this.authProvider.showError(success.statusMessage);
            }
        },
        error => {
            this.authProvider.showError(error);
        });
    }
}
