import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';
/**
 * Generated class for the EmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage {
  
  public emailForm:FormGroup;
  public signUpData:UserRequest;
  public validAge:boolean=false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public renderer:Renderer,
    public elementRef:ElementRef,
    public keyboard:Keyboard,
    public authProvider: AuthenticateProvider) {
    console.log('Hello EmailPage');
    this.signUpData = this.navParams.get("signUpData");
    this.emailForm = this.formBuilder.group({
      emailId: ['',Validators.compose([Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'), Validators.required]),''],
      dateOfBirth: ['',Validators.compose([Validators.required]),'']
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter EmailPage');
    const element = this.elementRef.nativeElement.querySelector('input');
      // we need to delay our call in order to work with ionic ...
      setTimeout(() => {
        console.log('EmailPage Focuser setTimeout');
          this.renderer.invokeElementMethod(element, 'focus', []);
          this.keyboard.show();
      }, 500);
  }

  validateAge(){
    let today:any = new Date().toISOString();
    let currentDate:any = Date.parse(today);
    const selectedDate:any = Date.parse(this.signUpData.dateOfBirth);
    let timeDiff:any = Math.abs(currentDate - selectedDate);
    let age = Math.floor((timeDiff / (1000 * 60 *60 * 24*365)));
    console.log('age:',age);
    if(age < 18){
        this.validAge = false;
    }else{
        this.validAge = true;
    }
  }

  onClose(){
    this.navCtrl.pop();
  }
  
  onSubmit(){
    if(this.emailForm.valid && this.validAge){
      this.signUpData.emailId = this.signUpData.emailId.toLowerCase();
      this.authProvider.mobileOrEmailExist(this.signUpData).subscribe(success => {
          if((success.status !== undefined)&&(success.status == '0001')) {
              this.navCtrl.push('PasswordPage',{'signUpData':this.signUpData});
          }else {
              this.authProvider.showError(success.statusMessage);
          }
      },
      error => {
          this.authProvider.showError(error);
      });
    }
  }
}
