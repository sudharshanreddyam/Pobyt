import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { NamesComponent} from './names/names';
import { EmailComponent} from './email/email';
import { PasswordComponent} from './password/password';
import { MobileComponent} from './mobile/mobile';
import { OtpComponent} from './otp/otp';
import { Focuser } from "../../directives/focuser/focuser";

@NgModule({
  declarations: [
    SignupPage,
    NamesComponent,
    EmailComponent,
    PasswordComponent,
    MobileComponent,
    OtpComponent,
    Focuser
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
  ],
})
export class SignupPageModule {}
