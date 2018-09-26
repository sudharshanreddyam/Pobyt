import { Component,EventEmitter,Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

/**
 * Generated class for the NamesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'names',
  templateUrl: 'names.html'
})
export class NamesComponent {

	public namesForm:FormGroup;
	public firstName:string;
	public lastName:string;
	public gender:string="";
	@Output() backClicked : EventEmitter<any> = new EventEmitter();
	@Output() closeClicked : EventEmitter<any> = new EventEmitter();
	@Output() dataSubmit : EventEmitter<any> = new EventEmitter();
	
	constructor(public formBuilder: FormBuilder) {
		console.log('Hello NamesComponent Component');
		this.namesForm = this.formBuilder.group({
		    firstName: ['',Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-z A-Z ]+'), Validators.required]),''],
		    lastName: ['',Validators.compose([Validators.maxLength(30), Validators.minLength(3), Validators.pattern('[a-z A-Z ]+'), Validators.required]),'']
		});
	}
	
	onBack(){
		this.backClicked.emit();
	}

	onClose(){
		this.closeClicked.emit();
	}

	onSubmit(){
		if(this.namesForm.valid){
			this.dataSubmit.emit({'firstName':this.firstName,'lastName':this.lastName,'gender':this.gender});
		}
	}
}
