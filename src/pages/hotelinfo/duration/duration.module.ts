import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DurationPage } from './duration';
import { InlinePicker} from './inlinepicker/inlinepicker';

@NgModule({
  declarations: [
    DurationPage,
    InlinePicker
  ],
  imports: [
    IonicPageModule.forChild(DurationPage),
  ],
})
export class DurationPageModule {}
