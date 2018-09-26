import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthenticateProvider} from '../../../providers/authenticate/authenticate';

/**
 * Generated class for the UpdateDOBPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatedob',
  templateUrl: 'updatedob.html',
})
export class UpdateDOBPage {
	public emailForm:FormGroup;
	public validAge:boolean=false;
  	public dateOfBirth:string;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
	    public formBuilder: FormBuilder,
	    public renderer:Renderer,
	    public elementRef:ElementRef,
	    public keyboard:Keyboard,
	    public authProvider: AuthenticateProvider) {
	    this.emailForm = this.formBuilder.group({
	      dateOfBirth: ['',Validators.compose([Validators.required]),'']
	    });
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UpdateDOBPage');
	}

	validateAge(){
	    let today:any = new Date().toISOString();
	    let currentDate:any = Date.parse(today);
	    const selectedDate:any = Date.parse(this.dateOfBirth);
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
			let inputData = this.authProvider.getUserInfo();
			inputData.dateOfBirth = this.dateOfBirth;			
			this.authProvider.updateProfile(inputData).subscribe(success => {
	            if((success.status !== undefined)&&(success.status == '0001')) {
	                this.authProvider.getUserInfo().dateOfBirth = this.dateOfBirth;
	                this.navCtrl.pop();
	            }
	        },
	        error => {
	            this.authProvider.showError("Service Error. Please try again!");
	        });
		}
	}
}
