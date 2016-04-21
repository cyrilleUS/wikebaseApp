/// <reference path="../../../typings/cordova-contacts.d.ts" />
// *****************************************************************
// Warning, all the contact object use in this page are the contacts from the cordova-plugin-contacts.
// *****************************************************************

import {Page, Alert, IonicApp, NavController, ViewController} from 'ionic-angular';
import {NewContactPage} from '../new-contact/new-contact';

@Page({
  templateUrl: 'build/pages/my-contact/my-contact.html'
})
export class MyContactPage {

    searchQuery: string;
    contactList: Contact[];

    constructor(private app: IonicApp, private nav: NavController, private viewController: ViewController) {
        this.searchQuery = '';

    }
    onPageLoaded(){
        this.debugAlert("onloaded","onloaded")
        this.getAllContact();
    }
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
    }

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

    addContact(cordovaContact: Contact) {
        this.debugAlert(cordovaContact.displayName,cordovaContact.name.formatted);
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
        this.nav.push(NewContactPage,{
            firstName: cordovaContact.name.givenName,
            lastName: cordovaContact.name.givenName,
            email: cordovaContact.emails[0].value,
            phone: cordovaContact.phoneNumbers[0].value
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
