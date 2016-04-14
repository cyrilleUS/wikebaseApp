import {Page} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import {Contact} from '../../models/Contact';
import {IonicApp} from 'ionic-angular';
import {NewContactPage} from '../new-contact/new-contact';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactServices: ContactServices;
  contactList;

  constructor(contactServices: ContactServices, private app: IonicApp) {
    this.contactServices = contactServices;
  }

  onPageLoaded(){

  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
    this.contactList = this.contactServices.getAll();
  }
  onPageDidEnter(){}
  onPageWillLeave() {
    /*to do just before the page is leaved*/
  }
  onPageDidLeave() {}
  onPageWillUnload() {}
  onPageDidUnload() {}

  showNewContactPage() {
    let nav = this.app.getComponent("nav");
    nav.setRoot(NewContactPage);
  }
}
