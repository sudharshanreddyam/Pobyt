import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';
import { Events } from 'ionic-angular';
/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    userInfo:any;
    profilePic:any;
    constructor(
        public navCtrl: NavController,
        public authProvider: AuthenticateProvider,
        public events: Events){
        this.userInfo = this.authProvider.getUserInfo();
        this.profilePic = this.userInfo.profilePicture;
        if(this.profilePic== '' || this.profilePic== undefined || this.profilePic== null){
            this.profilePic = 'assets/menu/oval.png';
        }
    }
    
    openPayment(){
        this.navCtrl.push('PaymentPage');
    }

    openPromotions(){
        this.navCtrl.push('PromotionsPage');
    }
    
    openProfile(){
        this.navCtrl.push('ProfilePage');
    }
    
    openHowItWorks(){
        this.navCtrl.push('HowitworksPage');
    }
    
    openInviteFriends(){
        this.navCtrl.push('InvitePage');
    }

    openBookings(){
        this.navCtrl.push('BookingHistoryPage')
    }
    
    openSupport(){

    }
    
    ionViewDidEnter() {
        this.events.publish('map:resize');
    }
}
