import {Page, IonicApp, MenuController, NavController, Alert} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../services/userService';
import {ContactService} from '../../services/contactService';
import {AuthenticationPage} from '../authentication/authentication';

@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {
    ownerName: string;

    constructor(private app: IonicApp, private nav: NavController, private menuController: MenuController, private userService: UserService, private contactService: ContactService ) {
    }

    onPageLoaded(){
        this.menuController.enable(true);
        this.ownerName = this.userService.loggedUser.firstName + " " + this.userService.loggedUser.lastName;
        if ( !this.contactService.isInitiated() ){
            this.contactService.init();
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
        let successCallback = this.disconnectSucess;
        let errorCallback = this.errorPopup;
        let callbackComponent = this.nav;
        this.userService.disconnect(this.userService.loggedUser, successCallback, errorCallback, callbackComponent);
    }

    disconnectSucess(nav: any) {
        nav.setRoot(AuthenticationPage);
    }

    errorPopup(messageToDisplay: Observable<string>, nav: any){
        let message: string;
        messageToDisplay.subscribe(
            data => {
                message = data;
            },
            error => {
                //todo
            },
            () => {
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
                    }
                );
                nav.present(alert);
            }
        );
    }
}
