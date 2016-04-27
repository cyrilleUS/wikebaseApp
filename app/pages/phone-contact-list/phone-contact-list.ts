/*
/// <reference path="../../../typings/cordova-contacts.d.ts" />
*/



import {Page, Alert, IonicApp, NavController, ViewController} from 'ionic-angular';
import {NewContactPage} from '../new-contact/new-contact';
import {WkContact} from '../../models/wkContact';
import {PhoneContactService} from '../../services/phoneContactService';

@Page({
  templateUrl: 'build/pages/phone-contact-list/phone-contact-list.html'
})
export class PhoneContactListPage {

    searchQuery: string;
    contactList: WkContact[];

    constructor(private app: IonicApp, private nav: NavController, private viewController: ViewController, private phoneContactService: PhoneContactService) {
        this.searchQuery = '';

    }
    onPageLoaded(){
        //this.debugAlert("onloaded","onloaded")
        //this.getAllContact();
        this.phoneContactService.getAllContact().subscribe(
            data => {
                this.contactList = data;
            },
            error => {
                console.log(error);
                this.debugAlert("!!!ERROR!!!", error);
            },
            () => {
                //
            }
        );
    }
    /*
    getAllContact() {
        navigator.contacts.find(['displayName'],
        // On sucess
        allContacts => {
            this.contactList = allContacts;
        },
        // On error
        onerror => {
            this.debugAlert("get all contact fail", "");
        // Options
        });
    }*/
/*
    getContact() {
        let options = new ContactFindOptions( );

        options.filter =  this.searchQuery;  //leaving this empty will find return all contacts

        options.multiple = true;  //return multiple results

        let filter = ["displayName"];

        navigator.contacts.find(filter,
        // On sucess
        allContacts => {
            this.contactList = allContacts;
        },
        // On error
        onerror => {
            this.debugAlert("get contact fail", "search:"+this.searchQuery);
        // Options
    }, options);
    }
*/
    addContact(contact: WkContact) {
        this.debugAlert(contact.firstName,contact.lastName);
        // Push to New Contact page
/*
        let contactName: string = cordovaContact.displayName;
        let contactFirstName: string = cordovaContact.name.givenName;
        let contactLastName: string = cordovaContact.name.familyName;
        let contactEmail: string = "";
        if( cordovaContact.emails && cordovaContact.emails[0].value ) {
            contactEmail += cordovaContact.emails[0].value;
        }
        let contactPhone: string = "";
        if(cordovaContact.phoneNumbers && cordovaContact.phoneNumbers[0].value ) {
            contactPhone += cordovaContact.phoneNumbers[0].value;
        }

        let contactAddressStreet: string = "";
        let contactAddressState: string = "";
        let contactAddressCity: string = "";
        let contactAddressCountry: string = "";
        let contactAddressCode: string = "";

        if(typeof cordovaContact.addresses[cordovaContact.addresses.length-1] !== 'undefined') {
            contactAddressStreet += cordovaContact.addresses[cordovaContact.addresses.length-1].streetAddress;
            contactAddressState += cordovaContact.addresses[cordovaContact.addresses.length-1].region;
            contactAddressCity += cordovaContact.addresses[cordovaContact.addresses.length-1].locality;
            contactAddressCountry += cordovaContact.addresses[cordovaContact.addresses.length-1].country;
            contactAddressCode += cordovaContact.addresses[cordovaContact.addresses.length-1].postalCode;
        }

        this.viewController.dismiss(
            {contactName, contactFirstName, contactLastName, contactEmail, contactPhone, contactAddressStreet, contactAddressState, contactAddressCity, contactAddressCountry, contactAddressCode}
        );
        */

        this.nav.setRoot(NewContactPage,{
            contact: contact
        });
    }

    debugAlert(title: string, message: string) {
        let alert = Alert.create({
          title: title,
          message: message,
          buttons: [
            { text:"ok"}
          ]
        });
        this.app.getComponent("nav").present(alert);
    }
}
