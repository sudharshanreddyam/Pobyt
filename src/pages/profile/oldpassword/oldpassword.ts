import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the OldPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oldpassword',
  templateUrl: 'oldpassword.html',
})
export class OldPasswordPage {

  	public passwordForm:FormGroup;
	public oldpassword:string;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private viewCtrl: ViewController,
		public formBuilder: FormBuilder,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard) {
		console.log('Hello OldPasswordPage Component');
		this.passwordForm = this.formBuilder.group({
			password: ['',Validators.compose([Validators.required]),'']
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter OldPasswordPage');
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
			this.navCtrl.push('NewPasswordPage',{"oldpassword":this.oldpassword}).then(() => {
				// first we find the index of the current view controller:
				const index = this.viewCtrl.index;
				// then we remove it from the navigation stack
				this.navCtrl.remove(index);
			});
		}
	}

}
