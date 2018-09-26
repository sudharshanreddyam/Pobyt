import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { UserRequest } from '../../../providers/authenticate/authenticate';
/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
	
	public passwordForm:FormGroup;
	public signUpData:UserRequest;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard) {
		console.log('Hello PasswordPage');
		this.signUpData = this.navParams.get("signUpData");
		this.passwordForm = this.formBuilder.group({
			password: ['',Validators.compose([Validators.required]),'']
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter PasswordPage');
		const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
	    	console.log('PasswordPage Focuser setTimeout');
	        this.renderer.invokeElementMethod(element, 'focus', []);
	        this.keyboard.show();
	    }, 500);
	}
	
	onClose(){
		this.navCtrl.pop();
	}

	onSubmit(){
		if(this.passwordForm.valid){
			this.navCtrl.push('MobilePage',{'signUpData':this.signUpData});
		}
	}
}
