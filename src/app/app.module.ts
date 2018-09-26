import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule , Config,  PageTransition,  Animation} from 'ionic-angular';
import { Pro } from '@ionic/pro';
import { HttpModule  } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { RoomyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticateProvider,GetAppContent,FacebookLoginService,GoogleLoginService } from '../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SearchPage } from '../pages/pages';
import { BookingModalPage } from '../pages/pages';
import { GetdatafromserverPage} from '../pages/pages';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Keyboard } from '@ionic-native/keyboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Network } from '@ionic-native/network';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import { CoreServiceProvider } from '../providers/core-service/core-service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

/*const IonicPro = Pro.init('6db184da', {
  appVersion: "1.0.0"
});

export class MyErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
  }
}*/

@NgModule({
  declarations: [
    RoomyApp,
    SearchPage,
    BookingModalPage,
    GetdatafromserverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(RoomyApp,{
        backButtonIcon: 'close',
        backButtonText: '',
        pageTransition: 'ios-transition',
        mode:'ios',
        platforms : {
          ios: {
            statusbarPadding: false,
            scrollPadding: false
          }
        }
    }),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RoomyApp,
    SearchPage,
    BookingModalPage,
    GetdatafromserverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FacebookLoginService,
    GetAppContent,
    GoogleLoginService,
    NativeStorage,
    Facebook,
    GooglePlus,
    AuthenticateProvider,
    SocialSharing,
    Keyboard,
    Diagnostic,
    Device,
    Network,
    AppAvailability,
    InAppBrowser,
    NativePageTransitions,
    OneSignal,
    AndroidPermissions,
    CoreServiceProvider,
    MobileAccessibility
  ]
})

export class AppModule {
}
