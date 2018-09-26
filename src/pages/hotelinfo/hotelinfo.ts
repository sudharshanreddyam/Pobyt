import { Component,ViewChild  } from '@angular/core';
import { ModalController, IonicPage,NavParams,NavController,Nav, AlertController, Events,Slides } from 'ionic-angular';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';

import { BookingModalPage } from '../pages';
/**
 * Generated class for the HotelinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-hotelinfo',
    templateUrl: 'hotelinfo.html',
})
export class HotelinfoPage {
    hotelInfo:any={};
    userInfo:any;
    page1: any = 'DurationPage';
    page2: any = 'AmenitiesPage';
    page3: any = 'HotelPolicyPage';
    @ViewChild(Slides) slides: Slides;
    constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public alertCtrl: AlertController,
     public modalCtrl: ModalController,
     private authProvider: AuthenticateProvider,
     private nav: Nav,
     public events: Events) {
        let env = this;
        this.hotelInfo = this.navParams.get("hotelInfo");
        this.hotelInfo.stayDetails = {};
        this.userInfo = this.authProvider.getUserInfo();
        events.subscribe('user:stayDetails', (details) => {
          env.hotelInfo.stayDetails = details;
        });
    }
    ngAfterViewInit() { 
      setTimeout(()=>{
       if(this.hotelInfo.photos && this.hotelInfo.photos.length > 0){
            this.slides.effect = 'slide';
            this.slides.autoplay = 3000;
            this.slides.speed = 2000;
            this.slides.loop = true;
            this.slides.startAutoplay()
        }
        },1000);
    }
      
    ionViewWillEnter() {
      this.nav.swipeBackEnabled = true;
   }

   ionViewWillLeave() {
       this.nav.swipeBackEnabled = false;
   }
    reserveNow(){
      let modalOptions = {
        showBackdrop: true,
        enableBackdropDismiss: false
      }
      let confirm = this.modalCtrl.create(BookingModalPage,{userFN: this.userInfo.firstName, userLN: this.userInfo.lastName},modalOptions);
      confirm.onDidDismiss(data => {
        //console.log('search > modal dismissed > data > ', data);
        if(data){
          if(data == 'accept'){
            console.log('returning Accept from modal');
            this.navCtrl.push('BookingPage',{for:"me",
                hotelInfo:this.hotelInfo
              }
            );
          }else{
            console.log('returning Others from modal');
            this.navCtrl.push('BookingPage',{for:"other",
                hotelInfo:this.hotelInfo
              }
            );
          }
        }
    })
      /*
      let confirm = this.alertCtrl.create({
        message: 'Booking For '+this.userInfo.firstName+" ?",
          buttons: [
              {
                  text: 'Other',
                  handler: () => {
                    this.navCtrl.push('BookingPage',{for:"other",
                        hotelInfo:this.hotelInfo
                      }
                    );
                  }
              },
              {
                  text: 'Yes',
                  handler: () => {
                    this.navCtrl.push('BookingPage',{for:"me",
                        hotelInfo:this.hotelInfo
                      }
                    );
                  }
              }
          ]
      });
      */
      confirm.present();
    }

}
