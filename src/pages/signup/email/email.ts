import { Component,EventEmitter,Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
/**
 * Generated class for the EmailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'email',
  templateUrl: 'email.html'
})
export class EmailComponent {

	public emailForm:FormGroup;
	public emailId:string;
    public dob:any;
    public validAge:boolean=true;
    @Output() backClicked : EventEmitter<any> = new EventEmitter();
    @Output() closeClicked : EventEmitter<any> = new EventEmitter();
    @Output() dataSubmit : EventEmitter<any> = new EventEmitter();

	constructor(public formBuilder: FormBuilder) {
		console.log('Hello EmailComponent Component');
		this.emailForm = this.formBuilder.group({
		    emailId: ['',Validators.compose([Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'), Validators.required]),''],
            dob: ['',Validators.compose([Validators.required]),'']
		});
	}
    
    onBack(){
        this.backClicked.emit();
    }

    onClose(){
        this.closeClicked.emit();
    }

    onSubmit(){
        if(this.emailForm.valid){
            this.dataSubmit.emit({'emailId':this.emailId,'dob':this.dob});
        }
    }

    validateAge(){
        let today:any = new Date().toISOString();
        let currentDate:any = Date.parse(today);
        const selectedDate:any = Date.parse(this.dob);
        let timeDiff:any = Math.abs(currentDate - selectedDate);
        let age = Math.floor((timeDiff / (1000 * 360 * 24 * 12))/365);
        console.log('age:',age);
        if(age < 18){
            this.validAge = false;
        }else{
            this.validAge = true;
        }
    }

}
