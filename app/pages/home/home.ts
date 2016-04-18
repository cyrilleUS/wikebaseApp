import {Page, IonicApp, MenuController, NavController} from 'ionic-angular';
import {UserServices} from '../../services/userServices';
import {ContactServices} from '../../services/contactServices';
import {AuthentificationPage} from '../authentification/authentification';
@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {
  ownerName: string;

  constructor(private app: IonicApp, private nav: NavController, private menuController: MenuController, private userServices: UserServices, private contactServices: ContactServices ) {

  }

  onPageLoaded(){
    this.menuController.enable(true);
    this.ownerName = this.userServices.loggedUser.firstName + " " + this.userServices.loggedUser.lastName;
    if ( !this.contactServices.isInitiated() ){
        this.contactServices.init();
    }
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
    this.nav.setRoot(AuthentificationPage);
  }
}
