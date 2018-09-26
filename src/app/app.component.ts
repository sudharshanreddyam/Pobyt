import { Component} from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthenticateProvider,GetAppContent, UserRequest } from '../providers/authenticate/authenticate';
import { OneSignal } from '@ionic-native/onesignal';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

@Component({
  templateUrl: 'app.html'
})
export class RoomyApp {
  touchedPointY:any;
  screenHeight:any;
  offsetY:any;
  rootPage: any;
  isOnline:boolean = false;
  connectionStatus = "";
  oneSignalId:any ="";
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    public authProvider: AuthenticateProvider,
    public contentProvider: GetAppContent,
    public keyboard:Keyboard,
    public network: Network,
    public oneSignal: OneSignal,
    private mobileAccessibility: MobileAccessibility) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // window.addEventListener('native.keyboardshow', this.keyboardShowHandler);
      // window.addEventListener('native.keyboardhide', this.keyboardHideHandler);
      // window.addEventListener('touchstart', this.tapCoordinates);
      this.statusBar.styleDefault();
      //this.statusBar.styleBlackTranslucent();
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      this.keyboard.disableScroll(true);
      this.keyboard.hideKeyboardAccessoryBar(false);
      this.loginFromNativeStorage();
      this.checkNetwork();
      if(this.mobileAccessibility){
        this.mobileAccessibility.usePreferredTextZoom(false);
     }
      if((this.network.type=='none' || this.network.type== null)&& this.platform.is('cordova')){
        this.connectionStatus = 'Oops! Sorry your are not connected to Internet.-Init';
        let env = this;
        setTimeout(function(){
          env.displayNetworkUpdate(env.connectionStatus,0, "toast-custom-changes-error")
        },3000);
      }else{
       this.isOnline = true;
      }
      this.startOnesignal();
      this.branchInit();
    });
  }
  readonly branchInit = () => {
    console.log('This is handle branch function');
    const Branch = window['Branch'];
    console.log(Branch);
    // only on devices
    if (!this.platform.is('cordova')) { return }
    //const Branch = window['Branch'];
    Branch.setDebug(true)
    Branch.initSession(data => {
      if (data['+clicked_branch_link']) {
        // read deep link data on click
        console.log('Deep Link Data: ' + JSON.stringify(data));
      }
    });
  }
  loginFromNativeStorage(){
    if(this.platform.is('cordova')){
      this.nativeStorage.getItem('userdata')
      .then(data => {
          let inputData:UserRequest = new UserRequest();
          inputData.action = "SIGNIN";
          inputData.loginType = "TOKEN";
          inputData.customerToken = data.customerToken;
          this.authProvider.login(inputData).subscribe(success => {
          if((success.status !== undefined)&&(success.status == '0001')) {
              this.authProvider.setCurrentUser(success);
              this.authProvider.setUserData(success);
              this.rootPage = 'HomePage';
            } else {
              this.rootPage = 'IntroPage';
            }
          },
          error => {
            this.rootPage = 'IntroPage';
          });
          this.contentProvider.setAppContent();
        },
        error => {
          this.rootPage = 'IntroPage';
        }
      );
    }else{
      this.contentProvider.setAppContent();
      this.rootPage = 'IntroPage';
    }
  }

  displayNetworkUpdate(connectionState: string, toastduration:number, customClass: string){
      let networkStatus = document.getElementById("network-status");
      let networkStatusText = document.getElementById("network-status-txt");
      networkStatusText.innerHTML = connectionState;
      networkStatus.setAttribute('class',customClass);
      networkStatus.style.display='block';
      if(toastduration > 0){
        setTimeout(function(){
          networkStatus.style.display='none';
        },toastduration);
      }
  }

  checkNetwork(){
        let env = this;
        this.network.onConnect().subscribe(env.connHandler.bind(env));
        this.network.onDisconnect().subscribe(env.connHandler.bind(env));

        this.platform.pause.subscribe(()=>{
          console.log('*******APP IS IN BACKGROUND*******');
        });

        this.platform.resume.subscribe(()=>{
          console.log('******APP IS IN FOREGROUND*******');
          this.branchInit();
          setTimeout(function(){
            env.network.onchange().subscribe(env.connHandler.bind(env));
            if(env.isOnline == false){
              env.connectionStatus = "Oops! Your are not connected to Internet.-resume"
              env.displayNetworkUpdate(env.connectionStatus, 0, "toast-custom-changes-error");
            }
          },3000);
        });
  }

  connHandler(data){
    if(data.type == 'online') {
      this.isOnline = true;
      this.connectionStatus = "Great! You are now connected to Internet.";
      this.displayNetworkUpdate(this.connectionStatus,2000,"toast-custom-changes-noerror");
    }
    else {
      this.isOnline = false;
      console.log('disconnected');
      this.connectionStatus = "Oops! Your are not connected to Internet.-connHandler"
      this.displayNetworkUpdate(this.connectionStatus,0, "toast-custom-changes-error");
    }
  }

  hideNetworkStatus(){
    let networkStatus = document.getElementById("network-status");
      networkStatus.style.display='none';
  }

  tapCoordinates(e) {
     this.touchedPointY = e.touches[0].clientY;
     this.screenHeight = window.innerHeight;
     this.offsetY = (this.screenHeight - this.touchedPointY);
  }

  keyboardShowHandler(e) {
      let keyboardHeight = e.keyboardHeight;
      console.log("keyboardHeight:",keyboardHeight);
      let bodyMove = <HTMLElement>document.querySelector("ion-app");
      let bodyMoveStyle = bodyMove.style;
      if (this.offsetY < (keyboardHeight + 40 ) ) {
          bodyMoveStyle.bottom = (keyboardHeight - this.offsetY + 40) + "px";
          bodyMoveStyle.top = "initial";
      }
  }

  keyboardHideHandler() {
     let removeStyles = <HTMLElement>document.querySelector("ion-app");
     removeStyles.removeAttribute("style");
  }
  startOnesignal(){
    if(this.platform.is('cordova')){
      this.oneSignal.startInit('3f510361-0522-429c-bc21-11967d844f17', '290879442891');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
       // do something when notification is received
        // alert("recevied");
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        // alert("opened");
      });
      this.oneSignal.getIds().then((ids) => {
        this.oneSignalId = ids.userId;
        console.log(this.oneSignalId);
      });
      this.oneSignal.endInit();
    }
  }
}
