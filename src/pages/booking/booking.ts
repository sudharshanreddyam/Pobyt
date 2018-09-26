import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonicPage, ModalController, NavController, NavParams, Events,AlertController } from 'ionic-angular';
import { AuthenticateProvider, User } from '../../providers/authenticate/authenticate';
import { Keyboard } from '@ionic-native/keyboard';
import { Http } from "@angular/http";

import { GetdatafromserverPage} from '../pages'

/**
 * Generated class for the BookingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var RazorpayCheckout: any;
@IonicPage()
@Component({
    selector: 'page-booking',
    templateUrl: 'booking.html',
})
export class BookingPage {
    userInfo:any;
    hotelInfo:any;
    bookForUser:boolean = true;
    bookForOther:boolean = true;
    customerDetailsForm:FormGroup;
    firstName:any;
    lastName:any;
    emailAddress:any;
    contactNumber:any;
    cityOfGovtId:any;
    dateOfBirth:any;
    keyboardOn: boolean = false;
    isDisabled: boolean = true;
    amountPayable:any;
    checked = false;
    validAge :any = false;
    lblTitle : any = '';
    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        private authProvider: AuthenticateProvider,
        public keyboard:Keyboard,
        public modalCtrl: ModalController,
        public http: Http,
        public events:Events) {
        this.hotelInfo = this.navParams.get("hotelInfo");
        this.userInfo = this.authProvider.getUserInfo();
        this.customerDetailsForm = this.formBuilder.group({
            firstName: ['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+'), Validators.required]),''],
            lastName: ['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+'), Validators.required]),''],
            contactNumber: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]+'), Validators.required]),''],
            cityOfGovtId: ['',Validators.compose([Validators.required]),''],
            emailId: ['',Validators.compose([Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'), Validators.required]),''],
            dateofBirth: ['',Validators.compose([Validators.required]),'']
        });       
    }

    ionViewDidLoad() {
        this.keyboard.onKeyboardShow().subscribe(success =>this.keyboardOn = true);
        this.keyboard.onKeyboardHide().subscribe(success => this.keyboardOn = false);
        let bookingFor = this.navParams.get("for");
        if(bookingFor == 'me'){
            this.bookForUser = true;
            this.firstName=this.userInfo.firstName;
            this.lastName=this.userInfo.lastName;
            this.emailAddress=this.userInfo.emailID.toLowerCase();
            this.contactNumber=this.userInfo.contactNumber;
            this.cityOfGovtId=this.userInfo.cityOfGovtId;
            this.lblTitle = this.cityOfGovtId;
            this.dateOfBirth=this.userInfo.dateOfBirth;
            if(this.customerDetailsForm.invalid){
                this.bookForOther = false;
            }else{
                this.bookHotel();
                this.bookForOther = true;               
            }
        }else if(bookingFor == 'other'){
            this.bookForUser = false;
            this.bookForOther = false;
        }
    }

    getUserCityDetails(){
        this.authProvider.showLoading();
        let modal = this.modalCtrl.create(GetdatafromserverPage);
        modal.onDidDismiss(data => {
            if(data){
                this.cityOfGovtId = data;
                this.lblTitle = data;
            }
        })
        modal.present();
    }
    openTerms() {
        this.navCtrl.push('PoliciesPage');
    }

    generateOrder(payAtDesk){
        let inputData:any = {};
        let _self = this;
        inputData.payAtDesk = payAtDesk;
        inputData.orderId = this.hotelInfo.bookingId;
        inputData.amount = this.hotelInfo.stayDetails.youPay;
        inputData.amount = Math.round(inputData.amount*100);
        this.authProvider.getPaymentOrderId(inputData).subscribe(success => {
            if(success.payAtDesk !== undefined && success.payAtDesk == true ){
                _self.openConfirmationPage(inputData.orderId,inputData.amount); 
            }else{
                if((success.amount !== undefined)) {
                    inputData.amount = success.amount;
                    _self.amountPayable = success.amount;
                    inputData.orderId = success.id;
                    _self.makePayment(inputData);
                }
            }
        },error => {
            this.authProvider.showError("Internal Server Error");
        })
    }

    makePayment(inputData){
        var amount =inputData.amount;
        var options = {
          description: 'Credits towards room booking',
          image: 'http://www.pobyt.co/img/logo_white.png',
          currency: 'INR',
          key: 'rzp_test_FLYFnbdzKtTKSX',
          amount:  parseInt(amount),
          name: 'Pobyt',
          order_id: inputData.orderId,
          id:inputData.orderId,
          prefill: {
            email: this.userInfo.emailID,
            contact: this.userInfo.contactNumber,
            name: this.userInfo.firstName +' '+this.userInfo.lastName,
          },
          theme: {
            color: '#4bf4de'
          },
          modal: {
            ondismiss: function() {
              console.log('payment window closed');
            }
          }
        };
        RazorpayCheckout.open(options, this.confirmbooking.bind(this), this.paymentFailed.bind(this));
    }
    confirmbooking(data){
        console.log(data);
        let inputData:any = {};
        inputData ={
            "paymentID": data,
            "pobytReservartionID":this.hotelInfo.bookingId
        }
        this.authProvider.capturePaymentDetails(inputData).subscribe(success => {
            console.log("payments captured  successfully");
            this.navCtrl.push('BookingConfirmPage',{"userInfo":this.userInfo,"hotelInfo":this.hotelInfo,"bookingName":this.firstName+' '+this.lastName,"paymentData": data,"amountPaid":this.amountPayable});
        },error => {
            this.authProvider.showError("Internal Server Error");
        });
    }

    openConfirmationPage(orderId,amount){
        this.amountPayable = amount;
        this.navCtrl.push('BookingConfirmPage',{"userInfo":this.userInfo,"hotelInfo":this.hotelInfo,"bookingName":this.firstName+' '+this.lastName,"paymentData": orderId,"amountPaid":this.amountPayable});
    }

    paymentFailed(){
        alert("Payment Failed");
    }

    validateDOB(){
        let today:any = new Date().toISOString();
        let currentDate:any = Date.parse(today);
        const selectedDate:any = Date.parse(this.dateOfBirth);
        let timeDiff:any = Math.abs(currentDate - selectedDate);
        let age = Math.floor((timeDiff / (1000 * 60 *60 * 24*365)));
        console.log('age:',age);
        if(age > 18){
            this.validAge = true;
        }else{
            this.validAge = false;
            this.authProvider.showError("Your age should be 18+ to book a room.");
        }
    }

    bookHotel(){
        if(!this.userInfo.cityOfGovtId && this.bookForUser == true){
                this.authProvider.setCityOfGovtId(this.cityOfGovtId);
        }
        let inputData = {
            "bookingForSelf": this.bookForUser,
            "bookingId": "",
            "cardIssuedCity": this.cityOfGovtId,
            "checkIn": Date.now(),
            "contactNumber": this.contactNumber,
            "customerToken": this.userInfo.customerToken,
            "duration": ((this.hotelInfo.stayDetails.hours*60) + (parseInt(this.hotelInfo.stayDetails.mins))),
            "firstName": this.firstName,
            "hotelId": this.hotelInfo.hotelId,
            "lastName": this.lastName,
            "pricePerMin": this.hotelInfo.pricePerMin,
            "userId": this.userInfo.userId,
            "emailAddress": this.emailAddress.toLowerCase()
        }
        this.authProvider.bookHotel(inputData).subscribe(success => {            
            if(success.result.reservationID !== undefined){
                this.hotelInfo.bookingId = success.result.reservationID;    
            }else{
                this.showError(success.result);
            }
           console.log(success.result);
        },error => {
            this.authProvider.showError("Internal Server Error");
        })
    }
    
    showError(inputData){
        let env = this;
        let confirm = this.alertCtrl.create({
        message: inputData,
        buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        env.navCtrl.popToRoot();
                    }
                }
            ]
        });
        confirm.present();
    }

    submitDetails(){
        this.validateDOB();
        if(this.bookForOther == false){
            if(this.validAge){
                this.bookForOther = true;
                this.bookHotel();
            }
        }
    }
    openPromos(){
        this.navCtrl.push('PromotionsPage');
    }
    editUserDetails(){
        this.bookForOther = false;
    }
    openTermsPage(){
        window.open('https://pobyt.co/terms-privacy.html', '_system');
    }
}
