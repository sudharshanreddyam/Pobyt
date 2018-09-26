import { Injectable } from '@angular/core';
import { Platform,AlertController} from 'ionic-angular';
import { LoadingController,Loading} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Http,Headers,RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { OneSignal } from '@ionic-native/onesignal';
import 'rxjs/Rx';
import { FacebookLoginService,GoogleLoginService } from '../../providers/providers';
/*
  Generated class for the AuthenticateProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export class User {
  emailID: string;
  contactNumber: string;
  firstName: string;
  midleName: string;
  lastName: string;
  dateOfBirth:string;
  userId:number;
  referralCode:string;
  customerToken: string;
  profilePicture:string;
  cityOfGovtId:string;
  location:any;
  oneSignalID:any;
  constructor(){
    this.emailID='';
    this.contactNumber='';
    this.firstName='';
    this.midleName='';
    this.lastName='';
    this.dateOfBirth='';
    this.userId=0;
    this.referralCode='';
    this.customerToken='';
    this.profilePicture='';
    this.cityOfGovtId='';
    this.oneSignalID='';
  }
}

export class UserRequest {
  action: string;
  cityOfGovtId:string;
  contactNumber: string;
  countryCode : string;
  coutryCode: string;
  customerToken: string;
  dateOfBirth: string;
  emailId: string;
  firstName:string;
  gender:string;
  lastName: string;
  loginType:string;
  oneSignalID:string;
  otp:number;
  password:string;
  userId:number;
  newPassword: string;
  oldpassword:string;
  profilePicture:string;
  referralCode:string;
  constructor(){
    this.action = '';
    this.cityOfGovtId = '';
    this.contactNumber = '';
    this.countryCode = '';
    this.customerToken = '';
    this.dateOfBirth = '';
    this.emailId = '';
    this.firstName = '';
    this.gender = '';
    this.lastName = '';
    this.loginType = '' ;
    this.oneSignalID='';
    this.password = '';
    this.userId = 0;
    this.newPassword = '';
    this.oldpassword = '';
    this.profilePicture='';
    this.referralCode='';
  }
}
 
@Injectable()
export class GetAppContent{
  appContent:any={};
  constructor(private http: Http){
  }

  setAppContent() {
    this.http.get('https://pobyt.co/en/content.json')
      .subscribe(data => {
        this.appContent = data.json();        
      });
  }

  getAppContent() {
    return this.appContent;
  }
}

@Injectable()
export class AuthenticateProvider {
  currentUser: User;
  loading:Loading;
  private environment:string;
  private cityList: any;
  private operatingCityList:any;
  constructor(
    private platform: Platform,
    private http: Http,
    private nativeStorage: NativeStorage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, 
    private facebookLoginService: FacebookLoginService,
    private googleLoginService: GoogleLoginService,
    private oneSignal: OneSignal) {
    this.environment = "http://pobyt-webapp.azurewebsites.net"
    }
  
  public login(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    this.oneSignal.getIds().then((ids) => {
      inputData["oneSignalID"]= ids.userId;
      console.log(inputData.oneSignalID);
    });
    
    let body = JSON.stringify(inputData);
    //console.log('authenticate:login:req:',inputData);
    var env = this;
    this.showLoading();
    console.log('BEFORE HTTTP POST TO USER REGISTRATION');
    console.log(inputData);
    return this.http.post(this.environment+'/userRegistration',body,options).map(res => {
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }
  
  public logout(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    //console.log('authenticate:logout:req:',inputData);
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/userLogout',body,options).map(res => {
      //console.log('authenticate:logout:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }
  public setCityList(list){
    this.cityList = list;
  }

  public getCityList(){
    return this.cityList;
  }
  public setOperatingCityList(data){
    this.operatingCityList = data;
  }
  public getOperatingCityList(){
    return this.operatingCityList;
  }
  public forgotPassword(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    //console.log('authenticate:forgotPassword:req:',inputData);
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/forgetPassword',body,options).map(res => {
      //console.log('authenticate:forgotPassword:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public getPaymentOrderId(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/generatePaymentOrderId?orderId='+inputData.orderId+'&amount='+inputData.amount+'&payAtDesk='+inputData.payAtDesk,{},options).map(res => {
      //console.log('authenticate:forgotPassword:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public capturePaymentDetails(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/capturePaymentDetails?paymentID='+inputData.paymentID+'&pobytReservartionID='+inputData.pobytReservartionID,{},options).map(res => {
      //console.log('authenticate:forgotPassword:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env)); 
  }

  public refundPayment(obj){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/refundPayments?paymentID='+obj.paymentId+'&amount='+obj.amountBeRefunded,{},options).map(res => {
      //console.log('authenticate:forgotPassword:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env)); 
  }

  public getUserInfo() : User {
    if(this.currentUser == undefined){
      this.currentUser = new User();
    }
    return this.currentUser;
  }
  
  public setCurrentUser(data){
    this.currentUser = new User();
    this.currentUser.emailID = data.result.emailAddress.toLowerCase();
    this.currentUser.contactNumber = data.result.contactNumber;
    this.currentUser.firstName = data.result.firstName;
    this.currentUser.midleName = data.result.midleName;
    this.currentUser.lastName = data.result.lastName;
    this.currentUser.dateOfBirth = data.result.dateOfBirth;
    this.currentUser.userId = data.result.userID;
    this.currentUser.referralCode = data.result.referralCode;
    this.currentUser.customerToken = data.customerToken;
    this.currentUser.cityOfGovtId = data.result.cityofgovtId;
    this.currentUser.profilePicture = data.result.profilePicture;
  }

  public setCityOfGovtId(city){
    this.currentUser.cityOfGovtId = city;
  }

  public setUserData(data){
    if(this.platform.is('cordova')){
      this.nativeStorage.setItem('userdata', {customerToken: data.customerToken});
      // .then(
      //   () => {
      //     console.log('Stored userdata in nativeStorage')
      //   },
      //   error =>{// console.error('Error storing item', error)
      //   }
      //);
    }
  }

  public removeUser(){
    if(this.platform.is('cordova')){
      this.nativeStorage.remove('userdata');
      this.nativeStorage.remove('loginType');
      this.facebookLoginService.doFacebookLogout();
      this.googleLoginService.doGoogleLogout();          
    }
  }
  
  public updateProfile(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    console.log('authenticate:profile-update:req',inputData);
    var env = this;
    this.showLoading();
    return this.http.post(this.environment+'/updateUserProfile',body,options)
    .map(res => {
      console.log('authenticate:profile-update:res',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public bookHotel(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    console.log('INPUT DATA BEFORE setReservartionDetails');
    console.log(inputData);
    let body = JSON.stringify(inputData);
    //console.log('HotelsbyLocation:req:',inputData);
    var env = this;
    this.showLoading('Booking your room...');
    return this.http.post(this.environment+'/hotel/setReservartionDetails',body,options)
    .map(res => {
      //console.log('HotelsbyLocation:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }
  
  public getHotels(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    //console.log('HotelsbyLocation:req:',inputData);
    var env = this;
    this.showLoading('Fetching Hotels...');
    return this.http.post(this.environment+'/getHotelsbyLocation',body,options)
    .map(res => {
      //console.log('HotelsbyLocation:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }


  public getBookingHistory(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    //console.log('HotelsbyLocation:req:',inputData);
    var env = this;
    this.showLoading('Fetching Hotels...');
    return this.http.post(this.environment+'/getBookingHistory',body,options)
    .map(res => {
      //console.log('HotelsbyLocation:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public getHotelDetails(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    //console.log('HotelDetails:req:',inputData);
    var env = this;
    this.showLoading('Fetching Hotel...');
    return this.http.post(this.environment+'/getHotelDetails',body,options)
    .map(res => {
      //console.log('HotelDetails:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public mobileOrEmailExist(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    var env = this;
    this.showLoading('');
    //console.log('checkUserExistOrNot:req:',inputData);
    return this.http.post(this.environment+'/checkUserExistOrNot',body,options)
    .map(res => {
      //console.log('checkUserExistOrNot:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public changeContactNumber(inputData) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(inputData);
    var env = this;
    this.showLoading('');
    //console.log('changeContactNumber:req:',inputData);
    return this.http.post(this.environment+'/changeContactNumber',body,options)
    .map(res => {
      //console.log('changeContactNumber:res:',res.json());
      env.hideLoading();
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }
  
  public getListOfOperatedCities(inputData){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });
    var env = this;
    return this.http.post(this.environment+'/listOfCities?customerToken='+inputData.customerToken,{},options)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError.bind(env));
  }

  public handleError(error) {
    console.error(error);
    this.hideLoading();
    return Observable.throw(error.json().error || 'Server error');
  }

  public showError(text) {
    let alert = this.alertCtrl.create({
        title: ':( Oops!',
        message: text,
        buttons: [
            {
                text: 'OK',
                handler: data => {
                }
            }
        ]
    });
    alert.present();
  }
  
  public showLoading(inputData:string='Please wait...') {
    this.loading = this.loadingCtrl.create({
        content: inputData,
        dismissOnPageChange: true
    });
    this.loading.present();
  }

  public showLoadingText(inputData) {
    if(this.loading !== undefined){
        this.loading.setContent(inputData);
    }
  }

  public hideLoading() {
    if(this.loading !== undefined){
        this.loading.dismiss();
    }
  }

}
