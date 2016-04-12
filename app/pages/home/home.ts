import {Page} from 'ionic-angular';
import {UserServices} from '../../services/userServices';

@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {
  ownerName: string;
  constructor(userServices: UserServices) {

  }

  onPageLoaded(){
    this.ownerName = "Denis Denis";
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
