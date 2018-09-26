import { Component} from '@angular/core';
import { ModalController, AlertController, Platform } from 'ionic-angular';
import { Geolocation,PositionError } from '@ionic-native/geolocation';
import { AuthenticateProvider,UserRequest } from '../../providers/authenticate/authenticate';
import { Events } from 'ionic-angular';
import { SearchPage } from '../pages';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google:any;
declare var RichMarker : any;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage{
  public compassClicked:boolean = false;
  private map:any;
  private userGeoLocation:any;
  private zoomLevel:any = 5;
  private locationMarkers = [];
  private hotelMarkers = [];
  private selectedHotelMarkers = [];
  private placesService:any;
  private loading:any;
  private usersearchitem:any= "Nearby - Available now";
  private icons:any = {
    location: {
      url: "assets/map/inner.png", // url
      scaledSize: new google.maps.Size(32, 32), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    },
    locationGlow: {
      url: "assets/map/position_marker.gif", // url
      scaledSize: new google.maps.Size(36, 36), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    },
    hotel:{
      url: "assets/map/with rupee_unselected.png", // url
      scaledSize: new google.maps.Size(30, 54), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
      labelOrigin: new google.maps.Point(15,17)
    },
    selectedHotel:{
      url: "assets/map/with rupee_selected.png", // url
      scaledSize: new google.maps.Size(35, 59), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
      labelOrigin: new google.maps.Point(20,20)
    }
  };

	constructor(
		public geolocation: Geolocation,
		public modalCtrl: ModalController,
    public authProvider: AuthenticateProvider,
    public events: Events,
    private device: Device,
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController) {
	}

	ngAfterViewInit() {
    this.loading = document.getElementById("loaderoverlay");
    this.loading.style.display="block";
    this.events.subscribe('hotel:slideChanged',(currentIndex) => {
      for(let i = 0; i < this.selectedHotelMarkers.length; i++){
        if(i == currentIndex){
            this.hotelMarkers[i].setVisible(false);
            this.selectedHotelMarkers[i].setVisible(true);
            this.map.panTo(this.selectedHotelMarkers[i].getPosition());
        }else{
          this.selectedHotelMarkers[i].setVisible(false);
          this.hotelMarkers[i].setVisible(true);
        }
      }
    });
    this.events.subscribe('map:resize',() => {
        if(this.map !== undefined){
            google.maps.event.trigger(this.map, 'resize');
        }
    });
    this.loadMap();
  }

  private openSettings(){
    if(this.device.platform == 'ios' || this.device.platform == 'iOS'){
      this.diagnostic.switchToSettings().then((res)=>{
        this.getCurrenLocation();
      })
    }else{
      this.diagnostic.isLocationEnabled().then((isEnabled)=>{
        if(!isEnabled){
          this.diagnostic.switchToLocationSettings();
          this.diagnostic.isLocationAuthorized().then((isAuth)=>{
            if(isAuth){
              this.getCurrenLocation();
            }else{
              this.diagnostic.switchToSettings().then((res)=>{
                this.getCurrenLocation();
              })
            }
          })
        }else{
          this.diagnostic.isLocationAuthorized().then((isAuth)=>{
            if(isAuth){
              this.getCurrenLocation();
            }else{
              this.diagnostic.switchToSettings().then((res)=>{
                this.getCurrenLocation();
              })
            }
          })
        }
      })
    }
  }

  private showError(text) {
    let alert = this.alertCtrl.create({
        title: ':( Oops!',
        message: text,
        buttons: [
            {
                text: 'Allow',
                handler: data => {
                  const navTransition = alert.dismiss();
                  navTransition.then(() => {
                   this.openSettings();
                  });
                  return false;
                }
            }
        ]
    });
    alert.present();
  }

	private getCurrenLocation(){
      this.compassClicked = true;
      this.usersearchitem = "Nearby - Available now";
      let options = {enableHighAccuracy: true};
      this.geolocation.getCurrentPosition(options).then((res) => {
        this.authProvider.getUserInfo().location = res;
        this.userGeoLocation = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
        this.locationMarkers[1].setPosition(this.userGeoLocation);
        this.locationMarkers[1].setVisible(true);
        this.locationMarkers[0].setVisible(false);
        this.clearHotelMarkers();
        this.fetchHotels(this.userGeoLocation);
      })
      .catch((error) =>{
          if(error.code == 1 || error.code == 3){
            this.showError('Allow "Pobyt" to access your location while you use the app');
          }
      });
  }

  private loadMap(){
    this.userGeoLocation = new google.maps.LatLng('20.5937','78.9629');
    let mapStyles =[
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#d7e8e8"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#a8de87"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#c2d1d6"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c2d1d6"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#7d7d7d"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ];
    let mapOptions = {
      center: this.userGeoLocation,
      zoom: this.zoomLevel,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl:false,
      fullscreenControl:false,
      streetViewControl:false,
      compass:true,
      myLocationButton: true, // GEOLOCATION BUTTON
      indoorPicker: true,
      styles: mapStyles
    }
    this.map = new google.maps.Map(document.querySelector('#map'), mapOptions);
    google.maps.event.addListenerOnce(this.map,'tilesloaded',this.mapLoaded.bind(this));
	}

	private mapLoaded(){
      this.loading.style.display="none";
      let locationMarker = new google.maps.Marker({
        map: this.map,
        icon:this.icons.location,
        visible: false,
      });
      let locationGlowMarker = new google.maps.Marker({
        map: this.map,
        icon:this.icons.locationGlow,
        visible: false,
        optimized: false
      });
      this.locationMarkers.push(locationMarker);
      this.locationMarkers.push(locationGlowMarker);
      if(this.device.platform == 'ios' || this.device.platform == 'iOS'){
        this.getCurrenLocation();
      }else{
        this.diagnostic.isLocationAvailable().then((isAvail)=>{
          if(isAvail){
            this.getCurrenLocation();
          }else{
            this.showError('Please turn On your Location and Allow "Pobyt" to access it while you use the app');
          }
        })
      }
	}

  private fetchHotels(location){
    let inputData = {
      user_Latitude:location.lat(),
      user_Longitude:location.lng(),
      customerToken : this.authProvider.getUserInfo().customerToken,
      userId : this.authProvider.getUserInfo().userId
    };
    this.authProvider.getHotels(inputData).subscribe(data => {
      this.clearHotelMarkers();
      this.addHotelMarkers(data);
    });
  }

  private addHotelMarkers(data){
    let hotels = [];
    if(data.status !== undefined && (data.status == '0001' || data.status == '0010')){
        hotels = data.result;
    }
    if(hotels !== undefined && hotels.length !== 0 && data.status == '0001'){
     let bounds = new google.maps.LatLngBounds();
     let pClass = 'price';
     for (var i = 0; i < hotels.length; i++) {
       if(hotels[i].pricePerMin > 9){
         this.icons.hotel.url = "assets/map/double_unselected.png";
         this.icons.selectedHotel.url = "assets/map/double_selected.png";
         pClass = 'price';
       }else{
        this.icons.hotel.url = "assets/map/single_unselected.png";
        this.icons.selectedHotel.url = "assets/map/single_selected.png";
        pClass = 'price1';
       }
        let location = new google.maps.LatLng(hotels[i].latitude, hotels[i].longitude);
        let hotelMarker = new RichMarker({
          position: location,
          map: this.map,
          draggable: false,
          visibility: true,
          shadow: 'none',
          content: '<div class="my-marker">' +
          '<div><img style="width:30px;height:54px;" src="'+this.icons.hotel.url+'"/>'+'<span class="'+pClass+'">'+hotels[i].pricePerMin+'</span></div></div>'
      })
        google.maps.event.addListener(hotelMarker, 'click', () => {
          for (var j = 0; j < hotels.length; j++) {
            if((hotels[j].latitude == hotelMarker.getPosition().lat())){
                this.events.publish('hotel:marker',j);
               break;
            }
          }
      });
        this.hotelMarkers.push(hotelMarker);
        bounds.extend(hotelMarker.position);
        let selectedHotelMarker = new RichMarker({
          position: location,
          map: this.map,
          draggable: false,
          visible: false,
          shadow: 'none',
          content: '<div class="my-marker">' +
            '<div><img style="width:30px;height:54px;" src="'+this.icons.selectedHotel.url+'"/>'+'<span class="'+pClass+'">'+hotels[i].pricePerMin+'</span></div></div>'
        })
        google.maps.event.addListener(selectedHotelMarker, 'click', () => {
          for (var k = 0; k < hotels.length; k++) {
            if((hotels[k].latitude == selectedHotelMarker.getPosition().lat())){
                this.events.publish('hotel:marker',k);
               break;
            }
          }
      });
        this.selectedHotelMarkers.push(selectedHotelMarker);
        if(i == 0){
          this.hotelMarkers[i].setVisible(false);
          this.selectedHotelMarkers[i].setVisible(true);
        }
        let p1 = new google.maps.LatLng(this.userGeoLocation.lat(), this.userGeoLocation.lng());
        let p2 = new google.maps.LatLng(hotels[i].latitude,hotels[i].longitude);
        hotels[i].distance = this.calcDistance(p1,p2) + " Km";
      }
      this.map.fitBounds(bounds);
      if(this.map.getZoom()>16){
        this.map.setZoom(16);
      }
    }else{
      this.map.panTo(this.userGeoLocation);
    }
    this.events.publish('hotels:list',[hotels,data.status]);
  }

  private clearHotelMarkers() {
    for (var i = 0; i < this.hotelMarkers.length; i++) {
      this.hotelMarkers[i].setMap(null);
    }
    for (var j = 0; j < this.selectedHotelMarkers.length; j++) {
      this.selectedHotelMarkers[j].setMap(null);
    }
    this.hotelMarkers = [];
    this.selectedHotelMarkers = [];
  }

	compasClicked(){
    if(this.device.platform == 'ios' || this.device.platform == 'iOS'){
      this.getCurrenLocation();
    }else{
      this.diagnostic.isLocationAvailable().then((isAvail)=>{
        if(isAvail){
          this.getCurrenLocation();
        }else{
          this.showError('Allow "Pobyt" to access your location while you use the app');
        }
      })
    }
	}

	searchClicked(){
    let modal = this.modalCtrl.create(SearchPage);
    modal.onDidDismiss(data => {
        if(data){
          if(data == 'nearby'){
            this.compasClicked();
          }else{
            this.getPlaceDetail(data.place_id);
          }
        }
    })
    modal.present();
  }

  private getPlaceDetail(place_id:string):void {
      var self = this;
      var request = {
          placeId: place_id
      };
      this.placesService = new google.maps.places.PlacesService(this.map);
      this.placesService.getDetails(request, callback);
      function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              self.userGeoLocation = place.geometry.location;
              self.usersearchitem = place.name;
              self.locationMarkers[0].setPosition(self.userGeoLocation);
              self.locationMarkers[0].setVisible(true);
              self.locationMarkers[1].setVisible(false);
              self.clearHotelMarkers();
              self.compassClicked = false;
              self.fetchHotels(self.userGeoLocation);
          }
      }
  }

  private distanceInKm(userLatitude,userLongitude,hotelLatitude,hotelLongitude) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(hotelLatitude-userLatitude);  // deg2rad below
    var dLon = this.deg2rad(hotelLongitude-userLongitude);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(userLatitude)) * Math.cos(this.deg2rad(hotelLatitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    let distance:any;
    if((d%1) > 0)
        distance = d.toFixed(2) + " Km";
    else
        distance = d + " Km";
    return distance;
  }

  private deg2rad(deg) {
      return deg * (Math.PI/180)
  }
  private calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
  }
}
