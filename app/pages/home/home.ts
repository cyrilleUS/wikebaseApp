import {Page, IonicApp, MenuController, NavController, Alert} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
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
    this.userServices.disconnect(this.userServices.loggedUser, this.disconnectSucess, this.errorPopup, this.nav);
  }

  disconnectSucess(nav: any) {
      nav.setRoot(AuthentificationPage);
  }

  errorPopup(messageToDisplay: Observable<string>, nav: any){
    let message: string;
    messageToDisplay.subscribe(
      //
      data => {
        message = data;
      }, error => {
        //todo
      }, () => {
        let alert = Alert.create(
          {
            title: 'Disconnect Failed',
            message: ''+ message,
            buttons: [
              {
                text:'Ok',
                handler: () => {
                  //do nothing on complete
                }
              }
            ]
          });
          nav.present(alert);
        }
      );
  }
}
