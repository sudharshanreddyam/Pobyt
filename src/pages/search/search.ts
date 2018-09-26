import { Component, OnInit, NgZone, Renderer, ElementRef } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticateProvider} from '../../providers/authenticate/authenticate';
declare var google: any;
@Component({
    selector : 'search',
    templateUrl: 'search.html'
})
export class SearchPage implements OnInit{

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;
    places:any;
    hideDefinedlist:any=false;

    constructor(public viewCtrl: ViewController,
        private zone:NgZone,
        public navCtrl: NavController,
        public renderer: Renderer,
        public elementRef: ElementRef,
        public authProvider: AuthenticateProvider) {
        if((this.authProvider.getOperatingCityList() == undefined)||(this.authProvider.getOperatingCityList() == null)){
            let inputData = {
             customerToken:this.authProvider.getUserInfo().customerToken
            };
            this.authProvider.getListOfOperatedCities(inputData).subscribe(success => {
            if((success.status !== undefined)&&(success.status == '0001')) {
                if(success.result !== undefined){
                    if(success.result.length>3){
                        success.result.splice(3);
                        this.places = success.result;
                    }else{
                        this.places = success.result;
                    }
                    this.authProvider.setOperatingCityList(this.places);
                }
            }
          });
        }else{
            this.places = this.authProvider.getOperatingCityList();
        }
    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    ngAfterViewInit() {
        let searchInput = this.elementRef.nativeElement.querySelector('input');
        if (!searchInput) {
            searchInput = this.elementRef.nativeElement.querySelector('textarea');
        }
        setTimeout(() => {
          this.renderer.invokeElementMethod(searchInput, 'focus', []);
        }, 500);
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
    swiped(e){
      console.log('swipe event fired');
      console.log(e);
    }
    clear() {
        this.hideDefinedlist =  false;
    }
    nearBy(){
      this.viewCtrl.dismiss("nearby");
    }
    chooseItem(item: any) {
        this.viewCtrl.dismiss(item);
    }

    definedItemSelected(place){
        let searchItems:any;
        this.autocomplete.query = place;
        let self = this;
        let config = {
            componentRestrictions: { country: 'IN' },
            input: this.autocomplete.query
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            self.zone.run(function(){
                searchItems = [];
                predictions.forEach(function (prediction) {
                    searchItems.push(prediction);
                });
                if(searchItems.length>0){
                    self.chooseItem(searchItems[0]);
                }
            });
        });
    }

    updateSearch() {
        //console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            this.hideDefinedlist =  false;
            return;
        }else{
            this.hideDefinedlist =  true;
        }
        let self = this;
        let config = {
            componentRestrictions: { country: 'IN' },
            // types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            //console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            self.zone.run(function(){
                predictions.forEach(function (prediction) {
                    self.autocompleteItems.push(prediction);
                });
            });
        });
    }

}
