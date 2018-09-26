import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
// import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/**
 * Generated class for the PreviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  @ViewChild(Slides) slider: Slides;
  slides =[
    {
      "image":"assets/preview/screen1.jpg"
    },
    {
      "image":"assets/preview/screen2.jpg"
    }
  ];
  constructor(public navCtrl: NavController,
    public navParams: NavParams/*,
    private nativePageTransitions: NativePageTransitions*/) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PreviewPage');
  }

  BookIn(){
      this.navCtrl.setRoot('LoginPage');
    }
  }
