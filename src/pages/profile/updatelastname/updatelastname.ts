import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider } from '../../../providers/authenticate/authenticate';

/**
 * Generated class for the UpdateLastNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatelastname',
  templateUrl: 'updatelastname.html',
})
export class UpdateLastNamePage {
	public namesForm:FormGroup;
	public lastName:string;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard,
		private authProvider: AuthenticateProvider) {
		this.namesForm = this.formBuilder.group({
			lastName: ['',Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-zA-Z ]+'), Validators.required]),''],
		});
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad UpdateLastNamePage');
		const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
	        this.renderer.invokeElementMethod(element, 'focus', []);
	        this.keyboard.show();
	    }, 500);
	}

	onClose(){
		this.navCtrl.pop();
	}
	
	onSubmit(){
		if(this.namesForm.valid){
			let inputData = this.authProvider.getUserInfo();
			inputData.lastName = this.lastName;
			this.authProvider.updateProfile(inputData).subscribe(success => {
	            if((success.status !== undefined)&&(success.status == '0001')) {
	                this.authProvider.getUserInfo().lastName = this.lastName;
	                this.navCtrl.pop();
	            }
	        },
	        error => {
	            this.authProvider.showError("Service Error. Please try again!");
	        });
		}
	}

}
