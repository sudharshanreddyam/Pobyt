import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { AuthenticateProvider, UserRequest } from '../../providers/authenticate/authenticate';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
	@ViewChild(Slides) slides: Slides;
	public signUpData:UserRequest;
    
	constructor(public navCtrl: NavController,
        private authProvider: AuthenticateProvider) {
	    this.signUpData = new UserRequest();
	}

	ionViewDidEnter() {
        this.slides.lockSwipes(true);
		console.log('ionViewDidLoad SignupPage');
	}

    reSendOtp(){
        this.userRegRequest();
    }

    userRegRequest(){
        this.signUpData.action = 'SIGNUP';
        this.signUpData.loginType = 'APP';
        this.authProvider.login(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0009')) {
                this.signUpData.action ='OTP';
                this.signUpData.customerToken = success.customerToken;
                this.signUpData.userId = success.result.userId;
                this.nextClicked();
            }else {
                this.authProvider.showError(success.statusMessage);
            }
        },
        error => {
            this.authProvider.showError(error);
        });
    }

    closeClicked(){
        this.navCtrl.pop();
    }

    nextClicked(){
	    this.slides.lockSwipeToNext(false);
	    this.slides.slideNext();
	    this.slides.lockSwipeToNext(true);
	}

    backClicked(){
        this.slides.lockSwipeToPrev(false);
        this.slides.slidePrev();
        this.slides.lockSwipeToPrev(true);
    }

    namesSubmit(inputData){
        this.signUpData.firstName = inputData.firstName;
        this.signUpData.lastName = inputData.lastName;
        this.signUpData.gender = inputData.gender;
        this.nextClicked();
    }

    emailSubmit(inputData){
        this.signUpData.emailId = inputData.emailId;
        this.signUpData.dateOfBirth = inputData.dob;
        this.authProvider.mobileOrEmailExist(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
                this.nextClicked();
            }else {
                this.authProvider.showError(success.statusMessage);
            }
        },
        error => {
            this.authProvider.showError(error);
        });
    }

    passwordSubmit(inputData){
        this.signUpData.password = inputData.password;
        this.nextClicked();
    }

    mobileSubmit(inputData){
        this.signUpData.contactNumber = inputData.contactNumber;
        this.signUpData.countryCode = inputData.countryCode;
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

    otpSubmit(inputData){
        this.signUpData.action = 'OTP';
        this.signUpData.loginType = 'APP';
        this.signUpData.otp = inputData.otp;
        this.authProvider.login(this.signUpData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
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
