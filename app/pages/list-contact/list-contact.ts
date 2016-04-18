import {IonicApp, Modal, Platform, NavController, NavParams, ViewController, Alert, Page} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {ContactServices} from '../../services/contactServices';
import {Contact} from '../../models/Contact';
import {NewContactPage} from '../new-contact/new-contact';
import {EditContactPage} from '../edit-contact/edit-contact';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactList: Array<Contact>;


  constructor( private app: IonicApp, private nav: NavController, private viewController: ViewController, private contactServices: ContactServices ) {

  }

  onPageLoaded(){
      console.log("*****************************");
    console.log("page loaded list contact");
    this.contactList = this.contactServices.getAll();
  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
    console.log("will enter list contact");

  }
  onPageDidEnter(){
    console.log("list contact did enter");
  }
  onPageWillLeave() {
    console.log("list contact will leave");
  }
  onPageDidLeave() {console.log("list contact did leave");}
  onPageWillUnload() {
    console.log("list contact will unload");
    console.log("*****************************");
  }
  onPageDidUnload() {console.log("list contact did unload");}

  editContact(contact: Contact) {
    console.log("about to edit contact:"+contact.firstName);
    /*let modal = Modal.create(EditContactPage, contact);
    this.nav.present(modal);*/

    let editContactModal = Modal.create(EditContactPage, {
      contact: contact
    });
    this.nav.present(editContactModal);
    /*this.app.getComponent("nav").push(EditContactPage, {
      contact: contact
    });*/
  }
  deleteContact(contact: Contact){
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
              this.contactServices.deleteContact( contact, successCallback, errorCallback, callbackComponent);
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
    /*let nav = this.app.getComponent("nav");
    nav.setRoot(NewContactPage);*/
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
              }]
      });
    nav.present(alert);
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
          });
          nav.present(alert);
        }
      );
  }
}
