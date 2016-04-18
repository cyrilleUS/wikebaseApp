import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController} from 'ionic-angular';
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
    this.contactList = this.contactServices.getAll();
  }

  onPageLoaded(){
    console.log("list contact loaded");
    this.contactServices.refresh();

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
    this.nav.setRoot(EditContactPage, {
      contact: contact
    });
  }

  showNewContactPage() {
    //let nav = this.app.getComponent("nav");
    this.nav.push(NewContactPage);
  }
}
