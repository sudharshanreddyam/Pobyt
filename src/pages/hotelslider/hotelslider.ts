import { Component, ViewChild} from '@angular/core';
import { NavController, Slides} from 'ionic-angular';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';
import { Events } from 'ionic-angular';
import { NgZone  } from '@angular/core';
/**
 * Generated class for the HotelsliderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-hotelslider',
  templateUrl: 'hotelslider.html',
})
export class HotelsliderPage {
    @ViewChild(Slides) slides: Slides;
    hotels:any;
    public hideCard:boolean = true;
    public hideSlide:boolean = false;
    public operatingCities:any = ["Hyderabad","Bangalore"];
    constructor(
        public navCtrl: NavController,
        public authProvider: AuthenticateProvider,
        public events: Events,
        public zone: NgZone) {
        events.subscribe('hotels:list', (hotelData) => {
          if(hotelData[1] == "0001"){
            this.hotels = hotelData[0];
          }else if(hotelData[1] == "0010"){
            this.hotels=[]
            if(hotelData[0].length >=6)
            hotelData[0] = hotelData[0].slice(0,6);
            this.operatingCities = hotelData[0];
          }
          if(this.hotels.length == 0 ){
            document.getElementById("white-footer").style.display = "none"
            this.hideCard = false;
            this.hideSlide = true;
          }else{
            document.getElementById("white-footer").style.display = "block";
            this.hideCard = true;
            this.hideSlide = false;
            this.slides.slideTo(0);
            // this.events.publish('hotel:slideChanged',0);
          }          
          this.zone.run(() => {
            //console.log('force refresh hotel silder');
          });
        });
        events.subscribe('hotel:marker',(index)=>{
          this.slides.slideTo(index);
        });
    }

    ionViewDidLoad() {
      //console.log('ionViewDidLoad PreviewPage');
    }

    slideChanged(){
      let currentIndex = this.slides.getActiveIndex();
      //console.log('slideChanged:',previousIndex,currentIndex);
      let length = this.slides.length();
      if(currentIndex < length){
        this.events.publish('hotel:slideChanged',currentIndex);
      }
    }

    hotelDetailedInfo(hotelInfo){
      if(hotelInfo.isAviablity)
        {
          let inputData = {
            hotelId:hotelInfo.hotelId,
            customerToken : this.authProvider.getUserInfo().customerToken
          };
          this.authProvider.getHotelDetails(inputData).subscribe(success => {
              if((success.status !== undefined)&&(success.status == '0001')) {
                success.result.distance = hotelInfo.distance;
                this.navCtrl.push('HotelinfoPage',{"hotelInfo":success.result} );
              }
          });
        }
    }

    getRating(hotelType){
      //making first letter uppercase and rest in lower case.
      return hotelType.charAt(0).toUpperCase() + hotelType.slice(1).toLowerCase();;
    }
}
