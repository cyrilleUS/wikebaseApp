import {Page} from 'ionic-angular';
import {UserServices} from '../../services/userServices';
import {ContactServices} from '../../services/contactServices';

@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {
  ownerName: string;
  userServices: UserServices;
  constructor(userServices: UserServices, contactServices: ContactServices) {
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
}
