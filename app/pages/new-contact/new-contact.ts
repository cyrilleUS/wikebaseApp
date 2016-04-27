/// <reference path="../../../typings/cordova-contacts.d.ts" />

import {IonicApp, NavController, ViewController, Alert, Page, Modal, NavParams, Toast} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';

import {ContactService} from '../../services/contactService';
import {PhoneContactListPage} from '../phone-contact-list/phone-contact-list';
import {HomePage} from '../home/home';
import {WkContact} from '../../models/wkContact';

@Page({
    templateUrl: 'build/pages/new-contact/new-contact.html'
})
export class NewContactPage {
    contactForm: ControlGroup;
    firstName: AbstractControl;
    lastName: AbstractControl;
    email: AbstractControl;
    contact: WkContact;


    constructor( private app: IonicApp, private nav: NavController, private navParams: NavParams, private viewController: ViewController, private contactService: ContactService, private formBuilder: FormBuilder ) {

        this.contact = navParams.get("contact");

        this.contactForm = formBuilder.group ({
            firstName: [(this.contact && this.contact.firstName)?this.contact.firstName:"", Validators.compose([Validators.required, Validators.minLength(3)])],
            lastName: [(this.contact && this.contact.lastName)?this.contact.lastName:"", Validators.compose([Validators.required, Validators.minLength(3)])],
            email: [(this.contact && this.contact.email)?this.contact.email:"" , Validators.compose([Validators.required, this.emailValidForm])],
            addressStreet: [''],
            addressCity:[''],
            addressState:[''],
            addressCode:[''],
            addressCountry:[''],
            mobileNumber:[(this.contact && this.contact.mobileNumber)?this.contact.mobileNumber:""],
            phoneNumber:['']
        })

        this.firstName = this.contactForm.controls['firstName'];
        this.lastName = this.contactForm.controls['lastName'];
        this.email = this.contactForm.controls['email'];
    }


    onPageLoaded(){
        this.viewController.showBackButton(false);
        //to do when we load the page the first time
        //works the same as ngOnInit
    }
    onPageWillEnter() {
        /*to do just before the display of the page*/
    }
    onPageDidEnter(){

    }
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
                    {
                        text:'Ok',
                        handler: () => {
                            nav.setPages( [
                                {page: HomePage}
                            ]);
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
                {
                    text:'Ok',
                    handler: () => {
                        nav.setPages( [
                            { page: HomePage }
                        ]);
                    }
                }
            ]
        });
        nav.present(alert);
    }

    addNewContact( event ) {
        if( !this.contactForm.valid ) {
            this.errorPopup( "invalid form", this.nav );
        } else {
            let contact: WkContact;
            let id = "" + ( this.contactService.getContactListSize() + 1 );
            contact = {
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
            this.contactService.addContact( contact, successCallback, errorCallback, callbackComponent );
        }
  }

    cancel() {
        if(this.viewController.viewType) {
            this.viewController.dismiss();
        } else {
            this.nav.setRoot(HomePage);
        }
    }

    openMyContact() {
        this.nav.push(PhoneContactListPage);
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
//******************************************************************************
//PRIVATE METHODS
//******************************************************************************
    private emailValidForm( control: Control ) {
        if (control.value){
            var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
            if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
                return { "emailValidForm": true };
            }
        }
        return null;
    }

}
