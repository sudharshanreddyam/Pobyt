import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { UserRequest } from '../../../providers/authenticate/authenticate';
/**
 * Generated class for the NamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
})
export class NamePage {
	
	public namesForm:FormGroup;
	public signUpData:UserRequest;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard) {
			console.log('Hello NamePage');
			this.signUpData = new UserRequest();
			this.namesForm = this.formBuilder.group({
			firstName: ['',Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-zA-Z ]+'), Validators.required]),''],
			lastName: ['',Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-zA-Z ]+'), Validators.required]),'']
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter NamePage');
		const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
	    	console.log('NamePage Focuser setTimeout');
	        this.renderer.invokeElementMethod(element, 'focus', []);
	        this.keyboard.show();
	    }, 500);
	}
	
	onClose(){
		this.navCtrl.pop();
	}
	
	onSubmit(){
		if(this.namesForm.valid){
			this.navCtrl.push('EmailPage',{'signUpData':this.signUpData});
		}
	}
}
