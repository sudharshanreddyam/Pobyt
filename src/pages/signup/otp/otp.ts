import { Component,EventEmitter,Input,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the OtpComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var SMS:any;
@Component({
  selector: 'otp',
  templateUrl: 'otp.html'
})
export class OtpComponent {

	public otpForm:FormGroup;
	public otp:string;
	@Input() countryCode : number;
    @Input() contactNumber : number;
	@Output() backClicked : EventEmitter<any> = new EventEmitter();
    @Output() closeClicked : EventEmitter<any> = new EventEmitter();
    @Output() dataSubmit : EventEmitter<any> = new EventEmitter();
    @Output() reSendClicked : EventEmitter<any> = new EventEmitter();

	constructor(public formBuilder: FormBuilder,public androidPermissions: AndroidPermissions) {
    console.log('Hello OtpComponent Component');
		this.otpForm = this.formBuilder.group({
		    otp: ['',Validators.compose([Validators.maxLength(6), Validators.pattern('[0-9]+'), Validators.required]),'']
		});
	}

  ionViewWillEnter()
  {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

  ionViewDidEnter(){
    this.watchOTPSms();
  }

  watchOTPSms(){
    if(SMS) SMS.startWatch(()=>{
      console.log('watching started');
    }, Error=>{
      console.log('failed to start watching');
    });
    document.addEventListener('onSMSArrive', (e:any)=>{
        if(e.address.indexOf('+20101')){
          this.otp = e.data.match(/\d/g);
          console.log(this.otp);
          SMS.stopWatch(function(){}, function(){});
          this.dataSubmit.emit({'otp':this.otp});
        }
    });
  }

  onBack(){
      this.otp = "";
      this.backClicked.emit();
  }

  onClose(){
      this.otp = "";
      this.closeClicked.emit();
  }

  onSubmit(){
      if(this.otpForm.valid){
          this.dataSubmit.emit({'otp':this.otp});
      }
  }

  reSendOtp(){
      this.reSendClicked.emit();
      //this.watchOTPSms();
  }
}
