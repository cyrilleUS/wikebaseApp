/// <reference path="../../../typings/cordova-contacts.d.ts" />

import {IonicApp, NavController, ViewController, Alert, Page, Modal, NavParams} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';

import {ContactServices} from '../../services/contactServices';
import {MyContactPage} from '../my-contact/my-contact';
import {HomePage} from '../home/home';
import {Contact} from '../../models/contact';

@Page({
  templateUrl: 'build/pages/new-contact/new-contact.html'
})
export class NewContactPage {
  contactForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;
  contact: Contact;
  importedFirstName: string;
  importedLastName: string;
  importedEmail: string;
  importedPhone: string;
  constructor( private app: IonicApp, private nav: NavController, private navParams: NavParams, private viewController: ViewController, private contactServices: ContactServices, private formBuilder: FormBuilder ) {

      this.importedFirstName = navParams.get("firstName");
      this.importedLastName = navParams.get("lastName");
      this.importedEmail = navParams.get("email");
      this.importedPhone = navParams.get("phone");


        this.contactForm = formBuilder.group ({
            firstName: [this.importedFirstName, Validators.compose([Validators.required, Validators.minLength(3)])],
            lastName: [this.importedLastName, Validators.compose([Validators.required, Validators.minLength(3)])],
            email: [this.importedEmail , Validators.compose([Validators.required, this.emailValidForm])],
            addressStreet: [''],
            addressCity:[''],
            addressState:[''],
            addressCode:[''],
            addressCountry:[''],
            mobileNumber:[this.importedPhone],
            phoneNumber:['']
        })

    this.firstName = this.contactForm.controls['firstName'];
    this.lastName = this.contactForm.controls['lastName'];
    this.email = this.contactForm.controls['email'];
  }

  emailValidForm( control: Control ) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "emailValidForm": true };
    }
    return null;
  }
  onPageLoaded(){
    this.viewController.showBackButton(false);
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

  successPopup( messageToDisplay: String, nav: any ){
    let alert = Alert.create({
        title: 'Contact Saved',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages( [
                      {page: HomePage}
                    ] );
                  }
              }]
      });
    nav.present(alert);
  }
  errorPopup( messageToDisplay: String, nav: any ){
    let alert = Alert.create({
        title: 'An Error Occured...',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages( [
                      {page: HomePage }
                    ]);
                  }
              }]
      });
    nav.present(alert);
  }

  addNewContact( event ) {
    if( !this.contactForm.valid ) {
      this.errorPopup( "invalid form", this.nav );
    }
    else {
      let contact: Contact;
      let id = "" + ( this.contactServices.getContactListSize() + 1 );
      contact =
      {
        "idContact": id,
        "firstName": this.contactForm.value.firstName,
        "lastName": this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressCity,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry,
        "mobileNumber": this.contactForm.value.mobileNumber,
        "phoneNumber": this.contactForm.value.phoneNumber
      };
      let successCallback = this.successPopup;
      let errorCallback = this.errorPopup;
      let callbackComponent = this.nav;
      this.contactServices.addContact( contact, successCallback, errorCallback, callbackComponent );
    }
  }

  cancel() {
    if(this.viewController.viewType) {
      this.viewController.dismiss();
    }
    else {
      this.nav.setRoot(HomePage);
    }
  }

  openMyContact() {
      this.nav.push(MyContactPage);
    /*let myContactModal = Modal.create(MyContactPage);
    myContactModal.onDismiss(
        data => {
            this.contactForm.value.lastName = data.contactLastName;
            this.contactForm.value.firstName = data.contactFirstName;*/
            /*
            let phoneContactName: string = data.contactName;
            let alert = Alert.create({
                title: 'Contact received.',
                message: 'Do you want to import the contact: ' + phoneContactName + '?',
                buttons: [
                        { text:'Yes',
                        handler: () => {
                            this.contactForm.value.firstName = data.contactFirstName,
                            this.contactForm.value.lastName = data.contactLastName,
                            this.contactForm.value.addressStreet = data.contactAddressStreet,
                            this.contactForm.value.addressCity = data.contactAddressCity,
                            this.contactForm.value.addressState = data.contactAddressState,
                            this.contactForm.value.addressCode = data.contactAddressCode,
                            this.contactForm.value.addressCountry = data.contactAddressCountry,
                            this.contactForm.value.phoneNumber = data.contactPhone,
                            this.contactForm.value.email = data.contactEmail
                        }
                    },
                        { text: 'No'}]
              });
            this.nav.present(alert);*/
            /*this.contactForm.value.firstName = data.firstName,
            this.contactForm.value.lastName = data.lastName,
            this.contactForm.value.addressStreet = data.addressStreet,
            this.contactForm.value.addressCity = data.addressCity,
            this.contactForm.value.addressState = data.addressState,
            this.contactForm.value.addressCode = data.addressCode,
            this.contactForm.value.addressCountry = data.addressCountry,
            this.contactForm.value.phoneNumber = data.phoneNumber,
            this.contactForm.value.email = data.email*/
        /*}
    );
    this.nav.present(myContactModal);*/
  }


}
