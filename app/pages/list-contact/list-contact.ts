import {Page} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import {Contact} from '../../models/Contact';

@Page({
  templateUrl: 'build/pages/list-contact/list-contact.html',
})
export class ListContactPage {
  contactServices;
  contactList;

  constructor(contactServices: ContactServices) {
    this.contactServices = contactServices;
  }

  onPageLoaded(){

  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
    this.contactServices.getAll().subscribe(contactList => this.contactList = contactList);
  }
  onPageDidEnter(){}
  onPageWillLeave() {
    /*to do just before the page is leaved*/
  }
  onPageDidLeave() {}
  onPageWillUnload() {}
  onPageDidUnload() {}
}
