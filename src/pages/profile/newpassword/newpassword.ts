import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider,UserRequest } from '../../../providers/authenticate/authenticate';

/**
 * Generated class for the NewPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newpassword',
  templateUrl: 'newpassword.html',
})
export class NewPasswordPage {

  public passwordForm:FormGroup;
	public newpassword:string;
	public oldpassword:string;
	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public renderer:Renderer,
		public elementRef:ElementRef,
		public keyboard:Keyboard,
		public alertCtrl: AlertController,
		public authProvider: AuthenticateProvider) {
		console.log('Hello NewPasswordPage');
		this.oldpassword = this.navParams.get("oldpassword");
		this.passwordForm = this.formBuilder.group({
			password: ['',Validators.compose([Validators.required]),'']
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidEnter NewPasswordPage');
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
			let inputData:UserRequest = new UserRequest();
        	inputData.action = 'SAVEPASSWORD';
        	inputData.newPassword = this.newpassword;
        	inputData.oldpassword = this.oldpassword;
        	inputData.contactNumber = this.authProvider.getUserInfo().contactNumber;
        	inputData.customerToken = this.authProvider.getUserInfo().customerToken;
        	inputData.userId = this.authProvider.getUserInfo().userId;
			this.authProvider.forgotPassword(inputData).subscribe(success => {
				if(success.statusMessage !== undefined) {
					this.showError(success.statusMessage);
				}
			},
			error => {
				this.authProvider.showError("Service Error. Please try again!");
			});
		}
	}

	showError(inputData){
        let env = this;
        let confirm = this.alertCtrl.create({
        message: inputData,
        buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        env.navCtrl.pop();
                    }
                }
            ]
        });
        confirm.present();
    }
}
