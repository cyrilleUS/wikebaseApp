import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController, Alert} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import {Contact} from '../../models/Contact';
import {NewContactPage} from '../new-contact/new-contact';
import {EditContactPage} from '../edit-contact/edit-contact';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactList: Array<Contact>;
s

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

  showNewContactPage() {
    /*let nav = this.app.getComponent("nav");
    nav.setRoot(NewContactPage);*/
    let newContactModal = Modal.create(NewContactPage);
    this.nav.present(newContactModal);
  }

  sortContactAlert() {
    let alert = Alert.create({
      title: "Sort Contact",
      message: "How do you want to sort your contact?",
      buttons: [
        { text:"By name",
          handler: () => {
            this.sortContact("name");
          }
        },{
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
      this.contactList = this.contactServices.sortContactByName();
    }
    else if (sortParameter == "date") {
      this.contactList = this.contactServices.sortContactByDate();
    }
  }
}
