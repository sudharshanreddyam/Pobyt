import { Component,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

/**
 * Generated class for the PasswordComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'password',
  templateUrl: 'password.html'
})
export class PasswordComponent {

	public passwordForm:FormGroup;
	public password:string;
	@Output() backClicked : EventEmitter<any> = new EventEmitter();
	@Output() closeClicked : EventEmitter<any> = new EventEmitter();
	@Output() dataSubmit : EventEmitter<any> = new EventEmitter();

	constructor(public formBuilder: FormBuilder) {
		console.log('Hello PasswordComponent Component');
		this.passwordForm = this.formBuilder.group({
		    password: ['',Validators.compose([Validators.required]),'']
		});
	}
	
	onBack(){
		this.backClicked.emit();
	}

	onClose(){
		this.closeClicked.emit();
	}

	onSubmit(){
		if(this.passwordForm.valid){
			this.dataSubmit.emit({'password':this.password});
		}
	}

}
