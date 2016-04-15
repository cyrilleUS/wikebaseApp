import {Page, IonicApp} from 'ionic-angular';
import {UserServices} from '../../services/userServices';
import {ContactServices} from '../../services/contactServices';
import {AuthentificationPage} from '../authentification/authentification';
@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {
  ownerName: string;
  userServices: UserServices;
  constructor(userServices: UserServices, contactServices: ContactServices, private app: IonicApp) {
    contactServices.init();
    this.userServices = userServices;
  }

  onPageLoaded(){
    this.ownerName = this.userServices.loggedUser.firstName + " " + this.userServices.loggedUser.lastName;
  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
  }
  onPageDidEnter(){}
  onPageWillLeave() {
    /*to do just before the page is leaved*/
  }
  onPageDidLeave() {}
  onPageWillUnload() {}
  onPageDidUnload() {}

  disconnect() {
    this.userServices.deleteLoggedUser();
    this.app.getComponent("nav").setRoot(AuthentificationPage);
  }
}
