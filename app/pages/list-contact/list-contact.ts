import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import {Contact} from '../../models/Contact';
import {NewContactPage} from '../new-contact/new-contact';
import {EditContactPage} from '../edit-contact/edit-contact';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactServices: ContactServices;
  contactList: Array<Contact>;


  constructor(contactServices: ContactServices, private app: IonicApp, public nav: NavController) {
    this.contactServices = contactServices;
    this.nav = nav;
  }

  onPageLoaded(){
    console.log("list contact loaded");
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
  onPageWillUnload() {console.log("list contact will unload");}
  onPageDidUnload() {console.log("list contact did unload");}

  editContact(contact: Contact) {
    console.log("about to edit contact:"+contact.firstName);
    /*let modal = Modal.create(EditContactPage, contact);
    this.nav.present(modal);*/
    let editContactModal = Modal.create(EditContactPage, {
      contact: contact
    });
    this.app.getComponent("nav").present(editContactModal);
    /*this.app.getComponent("nav").push(EditContactPage, {
      contact: contact
    });*/
  }

  showNewContactPage() {
    /*let nav = this.app.getComponent("nav");
    nav.setRoot(NewContactPage);*/
    let newContactModal = Modal.create(NewContactPage);
    this.app.getComponent("nav").present(newContactModal);
  }
}
