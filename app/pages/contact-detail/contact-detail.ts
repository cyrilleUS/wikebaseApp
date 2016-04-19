import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController, Alert} from 'ionic-angular';

import {Contact} from '../../models/contact';
import {EditContactPage} from '../edit-contact/edit-contact';
@Page({
  templateUrl: 'build/pages/contact-detail/contact-detail.html',
})
export class ContactDetailPage {
    contact: Contact;

  constructor( private app: IonicApp, private nav: NavController, private navParams: NavParams, private viewController: ViewController ) {
    /*initiate constants*/
    this.contact = navParams.get("contact");
    console.log("****************");
    console.log("in contact detail, contact.retrieved: "+this.contact.firstName);
  }
  onPageLoaded(){
    //to do when we load the page the first time
    //works the same as ngOnInit
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

  call(){
      window.open("tel:"+ this.contact.phoneNumber);
  }
  edit(){
      console.log("about to edit contact:"+this.contact.firstName);
      /*let modal = Modal.create(EditContactPage, contact);
      this.nav.present(modal);*/

      let editContactModal = Modal.create(EditContactPage, {
        contact: this.contact
      });
      this.nav.present(editContactModal);
  }
}
