import { Component } from '@angular/core';
import { IonicPage,NavController } from 'ionic-angular';
import { AuthenticateProvider,GetAppContent} from '../../providers/authenticate/authenticate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { window } from 'rxjs/operator/window';
/**
 * Generated class for the InvitePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage {
	userInfo:any;
	message:string;
  url:string;
  inviteMessage:string ="Ask your friends to signup with your referral link and make a reservation. Once done, both you and your friend earn <span>Rs.50</span> worth coupon.";
  appContent:string;
  readonly Branch : any = window['Branch'];

	constructor(public navCtrl: NavController,
        public authProvider: AuthenticateProvider,
        public contentProvider: GetAppContent,
        private socialSharing: SocialSharing) {
		this.userInfo = this.authProvider.getUserInfo();
		this.message = 'Hi Subscribe in Pobyt get 20 minutes stay for free';
		this.url = 'https://pobyt.co';
    this.appContent = this.contentProvider.getAppContent();
    // this.inviteMessage = this.appContent.inviteFriendsCotent;
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad InvitePage');
	}

	shareSheet(){
    var branchUniversalObj = null
    var buProperties = {};
    this.Branch.createBranchUniversalObject(properties).then(function (res) {
      branchUniversalObj = res
      console.log('Response: ' + JSON.stringify(res))
    }).catch(function (err) {
      console.log('Error: ' + JSON.stringify(err))
    })
    var properties = {
      $desktop_url: 'http://pobyt.co',
      custom_string: '',
      custom_integer: Date.now(),
      custom_boolean: true,
      custom_array: [1, 2, 3, 4, 5],
      custom_object: { 'random': 'dictionary' }
    }

    var message = 'Check out this link'
    branchUniversalObj.onShareSheetLaunched(function (res) {
      // android only
      console.log(res)
    })
    branchUniversalObj.onShareSheetDismissed(function (res) {
      console.log(res)
    })
    branchUniversalObj.onLinkShareResponse(function (res) {
      console.log(res)
    })
    branchUniversalObj.onChannelSelected(function (res) {
      // android only
      console.log(res)
    })

    // share sheet
    branchUniversalObj.showShareSheet(properties, message)
		// Opens up the share sheet so you can share using the app you like the most.
		// share(message, subject, file, url)
    /*
    this.socialSharing.share(this.message,'Pobyt',null,this.url).then(() => {
			// Success!
		}).catch(() => {
			// Error!
    });
    */
	}
}
