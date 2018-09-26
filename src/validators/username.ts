import { FormControl } from '@angular/forms';

export class UsernameValidator {
	env = this;
	userNameError:string;
	static isValid(control: FormControl): any {
		let mobileRegex = /^[0-9]+$/;
		let emailRegex = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
		let username = control.value;
		if (isNaN(username)){
			if(!username.match(emailRegex)){
				return {"Enter valid email" :true};
			}
		}else if(!isNaN(username)){
			if (!username.match(mobileRegex)){
				return {"Enter valid mobile":true};
			}
		}
		if ((!username.match(mobileRegex)) && (!username.match(emailRegex)))
	    {
	        //console.log("Enter valid user");
	        return {"Enter valid user":true};
	    }
	    return null;
	}
}