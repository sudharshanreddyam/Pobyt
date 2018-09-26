import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthenticateProvider,UserRequest } from '../../providers/authenticate/authenticate';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userInfo:any;
  readonly Branch:any = window['Branch'];
	constructor(public navCtrl: NavController,
  public navParams: NavParams,
  private platform : Platform,
  private nativeStorage: NativeStorage,
	public authProvider: AuthenticateProvider) {
    this.userInfo = this.authProvider.getUserInfo();
    this.nativeStorage.getItem('loginType').then((lt)=>{
      this.userInfo.loginType = lt.loginType;
    });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilePage');
	}

	logOut(){
      let inputData:UserRequest = new UserRequest();
      inputData.action = 'LOGOUT';
      inputData.loginType = 'APP';
      inputData.customerToken = this.authProvider.getUserInfo().customerToken;
      inputData.userId = this.authProvider.getUserInfo().userId;
      this.authProvider.logout(inputData).subscribe(success => {
        if((success.statusCode !== undefined)&&(success.statusCode == 0)) {
            this.authProvider.removeUser();
            this.navCtrl.setRoot('LoginPage');
            if(this.platform.is('cordova')){
              this.Branch.logout().then(function (res) {
                console.log('Response: ' + JSON.stringify(res))
              }).catch(function (err) {
                console.log('Error: ' + JSON.stringify(err.message))
              })
            }

        }
      },
      error => {
         this.authProvider.removeUser();
      });
  }
  
  updateFirstName(){
    this.navCtrl.push('UpdateFirstNamePage');
  }
  
  updateLastName(){
    this.navCtrl.push('UpdateLastNamePage');
  }
  
  updateMobile(){
    this.navCtrl.push('UpdatemobilePage');
  }
  
  updatePassword(){
     this.navCtrl.push('OldPasswordPage');
  }
  
  updateDOB(){
    this.navCtrl.push('UpdateDOBPage');
  }
}
