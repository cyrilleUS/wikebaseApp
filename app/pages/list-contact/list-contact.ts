
import {IonicApp, Modal, Platform, NavController, NavParams, ViewController, Alert, Page} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

import {ContactService} from '../../services/contactService';
import {WkContact} from '../../models/wkContact';
import {NewContactPage} from '../new-contact/new-contact';
import {EditContactPage} from '../edit-contact/edit-contact';
import {ContactDetailPage} from '../contact-detail/contact-detail';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactList: Array<WkContact>;
s

  constructor( private app: IonicApp, private nav: NavController, private viewController: ViewController, private contactService: ContactService ) {

  }

  onPageLoaded(){
    this.contactList = this.contactService.getAll();
  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
    //console.log("will enter list contact");

  }
  onPageDidEnter(){
    //console.log("list contact did enter");
  }
  onPageWillLeave() {
    //console.log("list contact will leave");
  }
  onPageDidLeave() {
      //console.log("list contact did leave");
  }
  onPageWillUnload() {
    //console.log("list contact will unload");
    //console.log("*****************************");
  }
  onPageDidUnload() {
      //console.log("list contact did unload");
  }

  editContact(contact: WkContact) {
    //console.log("about to edit contact:"+contact.firstName);
    let editContactModal = Modal.create(EditContactPage, {
      contact: contact
    });
    this.nav.present(editContactModal);

  }
  deleteContact(contact: WkContact){
    let alert = Alert.create(
      {
        title: "Delete Contact",
        message: "Sure?",
        buttons: [
          {
            text:"Yes",
            handler: () => {
              let successCallback = this.successDeletePopup;
              let errorCallback = this.errorPopup;
              let callbackComponent = this.nav;
              this.contactService.deleteContact( contact, successCallback, errorCallback, callbackComponent);
            }
          },
          {
            text: "No",
            handler: () => {
              //do nothing on complete
            }
          }
        ]
      });
      this.nav.present(alert);
    }

    showNewContactPage() {
        let newContactModal = Modal.create(NewContactPage);
        this.nav.present(newContactModal);
    }

    successDeletePopup(nav: any){
        let alert = Alert.create({
            title: 'Contact Deleted',
            message: "Your contact has been deleted !",
            buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setRoot(ListContactPage);
                  }
                }
            ]
        });
        nav.present(alert);
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
                        title: 'Editing Contact Failed',
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

    sortContactAlert() {
        let alert = Alert.create({
            title: "Sort Contact",
            message: "How do you want to sort your contact?",
            buttons: [
                {
                    text:"By name",
                    handler: () => {
                        this.sortContact("name");
                    }
                },
                {
                    text:"By date of creation",
                    handler: () => {
                        this.sortContact("date");
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    sortContact(sortParameter: string) {
        if(sortParameter == "name") {
            this.contactList = this.contactService.sortContactByName();
        } else if (sortParameter == "date") {
            this.contactList = this.contactService.sortContactByDate();
        }
    }

    contactDetail( event, contact: Contact ){
        this.nav.push(ContactDetailPage, {
            contact: contact
        });
    }
}
