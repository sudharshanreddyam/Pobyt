import { Component,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
/**
 * Generated class for the MobileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mobile',
  templateUrl: 'mobile.html'
})
export class MobileComponent {

	public mobileForm:FormGroup;
	public contactNumber:string;
	public countryList:any='';
    public countryselected:any = "";
    @Output() backClicked : EventEmitter<any> = new EventEmitter();
    @Output() closeClicked : EventEmitter<any> = new EventEmitter();
    @Output() dataSubmit : EventEmitter<any> = new EventEmitter();

	constructor(public formBuilder: FormBuilder,
		public http:Http) {
		console.log('Hello MobileComponent Component');
		this.mobileForm = this.formBuilder.group({
		    contactNumber: ['',Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]+'), Validators.required]),'']
		});
		this.getCountries().then((data)=>{
		  this.countryList = data;
		  this.countryselected = this.countryList[0];
		});
	}
	
    getCountries(){
        return new Promise(resolve =>{
            this.http.get(`assets/data/countries.json`)
            .subscribe(res => resolve(res.json()));
        });
    }

    selectCountry(){
        document.getElementById('selectTag').click();
    }
    
    onBack(){
        this.backClicked.emit();
    }

    onClose(){
        this.closeClicked.emit();
    }

    onSubmit(){
        if(this.mobileForm.valid){
            this.dataSubmit.emit({'contactNumber':this.contactNumber,'countryCode':this.countryselected.countryCode});
        }
    }
}
